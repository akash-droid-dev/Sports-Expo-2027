// "Edit this page": for the organisers' editors and admins, on the public pages. Click a text to
// retype it, a picture, video or background to swap it (link, upload or media library), a link
// to change where it goes; anything can be hidden. Saved to the `content` table and shown to
// every visitor at once (src/lib/platform/content.js). Loaded only for signed-in staff.
import { getClient, errorText } from './client';
import { applyOne, currentRows, keyFor, pageKey, refreshContent, restore, setRows, textOf } from './content';
import { publicUrl, upload } from './storage';

const CSS = `
.pfe-bar{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9800;display:flex;align-items:center;gap:10px;max-width:calc(100vw - 24px);padding:8px 8px 8px 18px;border-radius:999px;background:#0E0E0F;color:#fff;font:600 13px/1.3 var(--f-body,system-ui);box-shadow:0 14px 40px rgba(0,0,0,.35)}
.pfe-bar b{color:#F07C12}
.pfe-bar button,.pfe-pop button{border:0;border-radius:999px;min-height:34px;padding:0 14px;font:650 13px var(--f-body,system-ui);cursor:pointer;background:#F07C12;color:#0E0E0F;white-space:nowrap}
.pfe-bar button.g,.pfe-pop button.g{background:rgba(255,255,255,.12);color:#fff}
.pfe-pop button.l{background:#F6F4EF;color:#0E0E0F}
.pfe-pop button.r{background:#fdecea;color:#b42318}
.pfe-hl{position:fixed;z-index:9790;pointer-events:none;border-radius:6px;box-shadow:0 0 0 2px #F07C12,0 0 0 6px rgba(240,124,18,.18);transition:all .08s}
.pfe-hl span{position:absolute;left:-2px;top:-24px;padding:3px 8px;border-radius:6px 6px 6px 0;background:#F07C12;color:#0E0E0F;font:700 11px var(--f-body,system-ui);white-space:nowrap}
.pfe-on [contenteditable=true]{outline:2px solid #F07C12!important;outline-offset:3px;cursor:text!important}
.pfe-on *{cursor:pointer!important}
.pfe-pop{position:fixed;z-index:9810;width:min(380px,calc(100vw - 24px));padding:18px;border-radius:20px;background:#fff;color:#0E0E0F;box-shadow:0 24px 70px rgba(0,0,0,.3);font:500 14px/1.45 var(--f-body,system-ui)}
.pfe-pop h4{margin:0 0 10px;font:750 16px var(--f-display,system-ui)}
.pfe-pop label{display:block;margin:10px 0 4px;font-size:12px;font-weight:650;color:#4a4945}
.pfe-pop input[type=text],.pfe-pop input[type=url]{width:100%;box-sizing:border-box;min-height:40px;padding:8px 12px;border:0;border-radius:12px;background:#F6F4EF;font:500 14px var(--f-body,system-ui);color:#0E0E0F}
.pfe-pop .row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.pfe-lib{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-height:180px;overflow:auto;margin-top:8px}
.pfe-lib button{padding:0!important;aspect-ratio:1;border-radius:10px!important;background:#eee center/cover no-repeat!important}
.pfe-msg{font-size:12.5px;color:#b42318;margin-top:8px}
`;

let state = null;

function kindOf(el) {
  if (el.closest('.pfe-bar,.pfe-pop')) return null;
  if (el.tagName === 'IMG') return { el, kind: 'image', label: 'Picture' };
  if (el.tagName === 'VIDEO') return { el, kind: 'video', label: 'Video' };
  const v = el.querySelector?.(':scope > video');
  if (v && el.children.length <= 2) return { el: v, kind: 'video', label: 'Video' };
  const a = el.closest('a');
  if (a && a.closest('#dc-root')) return { el: a, kind: 'link', label: 'Link' };
  // Text: an element that holds its own words (not just a box around other elements).
  const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const simple = [...el.children].every((c) => /^(BR|B|I|EM|STRONG|SMALL|SUP|SUB)$/.test(c.tagName));
  if (own && simple) return { el, kind: 'text', label: 'Text' };
  for (let n = el; n && n.id !== 'dc-root'; n = n.parentElement) {
    if (/url\(/.test(n.style?.backgroundImage || '')) return { el: n, kind: 'bg', label: 'Background picture' };
  }
  if (own) return { el, kind: 'hideonly', label: 'Text (mixed)' };
  return { el, kind: 'hideonly', label: 'Block' };
}

async function save(target, kind, value, label) {
  const sb = await getClient();
  const key = keyFor(target);
  const row = { page: pageKey(), key, kind, value, label: label?.slice(0, 120) || null, updated_by: state.email };
  const { error } = await sb.from('content').upsert(row, { onConflict: 'page,key' });
  if (error) throw error;
  const next = currentRows().filter((r) => r.key !== key);
  next.push(row);
  setRows(next);
  applyOne(row);
}

async function unsave(target) {
  const key = keyFor(target);
  const row = currentRows().find((r) => r.key === key);
  if (!row) return;
  const sb = await getClient();
  const { error } = await sb.from('content').delete().eq('page', pageKey()).eq('key', key);
  if (error) throw error;
  restore(row);
  setRows(currentRows().filter((r) => r.key !== key));
}

function closePop() {
  state?.pop?.remove();
  if (state) state.pop = null;
}

function pop(x, y, html) {
  closePop();
  const p = document.createElement('div');
  p.className = 'pfe-pop';
  p.innerHTML = html;
  document.body.appendChild(p);
  const w = p.offsetWidth;
  const h = p.offsetHeight;
  p.style.left = Math.max(12, Math.min(x - w / 2, innerWidth - w - 12)) + 'px';
  p.style.top = Math.max(12, Math.min(y + 14, innerHeight - h - 80)) + 'px';
  state.pop = p;
  return p;
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function wire(p, target, done) {
  const msg = (t) => {
    let m = p.querySelector('.pfe-msg');
    if (!m) {
      m = document.createElement('div');
      m.className = 'pfe-msg';
      p.appendChild(m);
    }
    m.textContent = t;
  };
  const run = (fn) => async (e) => {
    e.preventDefault();
    const b = e.currentTarget;
    b.disabled = true;
    try {
      await fn();
      closePop();
      done?.();
      toast('Saved · live for everyone');
    } catch (x) {
      msg(errorText(x));
      b.disabled = false;
    }
  };
  p.querySelector('[data-a=hide]')?.addEventListener('click', run(() => save(target, 'hide', {}, 'Hidden: ' + textOf(target).slice(0, 60))));
  p.querySelector('[data-a=reset]')?.addEventListener('click', run(() => unsave(target)));
  p.querySelector('[data-a=cancel]')?.addEventListener('click', (e) => (e.preventDefault(), closePop()));
  return { run, msg };
}

async function mediaPicker(p, input, accept) {
  const up = p.querySelector('[data-a=upload]');
  up?.addEventListener('change', async () => {
    const f = up.files?.[0];
    if (!f) return;
    input.value = 'Uploading…';
    try {
      const path = await upload('media', `library/${Date.now().toString(36)}-${f.name.toLowerCase().replace(/[^\w.-]+/g, '-')}`, f);
      input.value = publicUrl('media', path);
    } catch (x) {
      input.value = '';
      alert(errorText(x));
    }
  });
  const lib = p.querySelector('.pfe-lib');
  if (!lib) return;
  try {
    const sb = await getClient();
    const { data } = await sb.storage.from('media').list('library', { limit: 60, sortBy: { column: 'created_at', order: 'desc' } });
    const files = (data || []).filter((f) => f.id && (accept === 'video' ? /\.(mp4|webm|mov)$/i : /\.(jpe?g|png|webp|gif|avif|svg)$/i).test(f.name));
    lib.innerHTML = files.length ? '' : '<span style="grid-column:1/-1;font-size:12px;color:#8a8780">Media library is empty.</span>';
    for (const f of files) {
      const url = publicUrl('media', 'library/' + f.name);
      const b = document.createElement('button');
      b.type = 'button';
      b.title = f.name;
      if (accept === 'video') b.textContent = '▶';
      else b.style.backgroundImage = `url("${url}")`;
      b.onclick = () => (input.value = url);
      lib.appendChild(b);
    }
  } catch {}
}

function edit(e) {
  if (e.target.closest?.('[contenteditable=true]')) return;
  const hit = kindOf(e.target);
  if (!hit) return;
  e.preventDefault();
  e.stopPropagation();
  const { el, kind, label } = hit;
  const has = currentRows().some((r) => r.key === keyFor(el));
  const resetBtn = has ? '<button class="r" data-a="reset">Undo my change</button>' : '';
  const x = e.clientX;
  const y = e.clientY;

  if (kind === 'text') {
    closePop();
    const before = textOf(el);
    el.dataset.pfOrig ??= before;
    el.contentEditable = 'true';
    el.focus();
    const finish = async (keep) => {
      el.removeEventListener('blur', onBlur);
      el.removeEventListener('keydown', onKey);
      el.contentEditable = 'false';
      el.removeAttribute('contenteditable');
      const now = textOf(el);
      if (!keep || now === before) {
        el.textContent = before;
        return;
      }
      try {
        await save(el, 'text', { text: now, orig: el.dataset.pfOrig }, now.slice(0, 80));
        toast('Saved · live for everyone');
      } catch (x2) {
        el.textContent = before;
        toast(errorText(x2), true);
      }
    };
    const onBlur = () => finish(true);
    const onKey = (k) => {
      if (k.key === 'Enter' && !k.shiftKey) (k.preventDefault(), el.blur());
      if (k.key === 'Escape') (k.preventDefault(), finish(false));
    };
    el.addEventListener('blur', onBlur);
    el.addEventListener('keydown', onKey);
    // Offer hide/undo as well, next to the text.
    const p = pop(x, y, `<h4>Text</h4><p style="margin:0;color:#4a4945">Type to change it; Enter to save, Esc to cancel.</p><div class="row"><button class="l" data-a="hide">Hide this</button>${resetBtn}<button class="g" style="background:#F6F4EF;color:#0E0E0F" data-a="cancel">Close</button></div>`);
    p.addEventListener('mousedown', (m) => m.preventDefault());
    wire(p, el, () => el.isContentEditable && finish(false));
    return;
  }

  if (kind === 'image' || kind === 'video' || kind === 'bg') {
    const cur = kind === 'bg' ? /url\(["']?([^"')]+)/.exec(el.style.backgroundImage)?.[1] || '' : el.currentSrc || el.getAttribute('src') || '';
    const p = pop(
      x,
      y,
      `<h4>${label}</h4>
      <label>Link to the ${kind === 'video' ? 'video (MP4)' : 'picture'}</label><input type="url" data-f="src" value="${esc(cur)}">
      <label>Or upload</label><input type="file" data-a="upload" accept="${kind === 'video' ? 'video/mp4,video/webm' : 'image/*'}">
      <label>Or pick from the media library</label><div class="pfe-lib"></div>
      <div class="row"><button data-a="save">Save</button><button class="l" data-a="hide">Hide</button>${resetBtn}<button class="l" data-a="cancel">Cancel</button></div>`,
    );
    const input = p.querySelector('[data-f=src]');
    mediaPicker(p, input, kind === 'video' ? 'video' : 'image');
    const { run } = wire(p, el);
    const orig = kind === 'bg' ? /url\(["']?([^"')]+)/.exec(el.style.backgroundImage)?.[1] || '' : el.getAttribute('src') || el.querySelector('source')?.getAttribute('src') || '';
    el.dataset.pfOrig ??= orig;
    p.querySelector('[data-a=save]').addEventListener(
      'click',
      run(() => {
        const src = input.value.trim();
        if (!/^(https?:\/\/|\/)/.test(src)) throw new Error('Add a link starting with https://, or upload a file.');
        return save(el, kind, { src, orig: el.dataset.pfOrig }, label + ': ' + src.split('/').pop());
      }),
    );
    return;
  }

  if (kind === 'link') {
    el.dataset.pfOrig ??= el.getAttribute('href') || '';
    const p = pop(
      x,
      y,
      `<h4>Link</h4>
      <label>Text</label><input type="text" data-f="text" value="${esc(textOf(el))}">
      <label>Goes to</label><input type="url" data-f="href" value="${esc(el.getAttribute('href') || '')}">
      <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-f="tab" ${el.target === '_blank' ? 'checked' : ''}> Open in a new tab</label>
      <div class="row"><button data-a="save">Save</button><button class="l" data-a="hide">Hide</button>${resetBtn}<button class="l" data-a="cancel">Cancel</button><button class="l" data-a="follow">Follow link</button></div>`,
    );
    const { run } = wire(p, el);
    const simpleText = [...el.children].every((c) => /^(BR|B|I|EM|STRONG|SPAN)$/.test(c.tagName) && !c.children.length);
    if (!simpleText) p.querySelector('[data-f=text]').disabled = true;
    p.querySelector('[data-a=follow]').addEventListener('click', () => (location.href = el.href));
    p.querySelector('[data-a=save]').addEventListener(
      'click',
      run(() => {
        const text = p.querySelector('[data-f=text]').value.trim();
        const href = p.querySelector('[data-f=href]').value.trim();
        return save(el, 'link', { href, text: simpleText && text !== textOf(el) ? text : undefined, newTab: p.querySelector('[data-f=tab]').checked, orig: el.dataset.pfOrig }, 'Link: ' + (text || href));
      }),
    );
    return;
  }

  const p = pop(x, y, `<h4>${label}</h4><p style="margin:0;color:#4a4945">This part can be hidden from the page.</p><div class="row"><button data-a="hide">Hide this</button>${resetBtn}<button class="l" data-a="cancel">Cancel</button></div>`);
  wire(p, el);
}

function hover(e) {
  if (state.pop) return;
  const hit = kindOf(e.target);
  if (!hit) return (state.hl.style.display = 'none');
  const r = hit.el.getBoundingClientRect();
  Object.assign(state.hl.style, { display: 'block', left: r.left - 3 + 'px', top: r.top - 3 + 'px', width: r.width + 6 + 'px', height: r.height + 6 + 'px' });
  state.hl.firstChild.textContent = hit.kind === 'hideonly' ? hit.label + ' · hide' : hit.label;
}

let toastTimer = 0;
function toast(t, bad) {
  let el = document.querySelector('.pfe-toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'pf-toast pfe-toast';
    document.body.appendChild(el);
  }
  el.textContent = t;
  el.style.background = bad ? '#b42318' : '#0E0E0F';
  el.style.bottom = '78px';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), bad ? 5000 : 2200);
}

function setEditing(on) {
  state.on = on;
  document.documentElement.classList.toggle('pfe-on', on);
  state.bar.innerHTML = on
    ? '<span><b>Editing</b> · click any text, picture or link</span><button data-a="done">Done</button>'
    : '<span>Organiser view</span><button data-a="edit">Edit this page</button><button class="g" data-a="admin">Admin</button>';
  state.bar.querySelector('[data-a=done]')?.addEventListener('click', () => setEditing(false));
  state.bar.querySelector('[data-a=edit]')?.addEventListener('click', () => setEditing(true));
  state.bar.querySelector('[data-a=admin]')?.addEventListener('click', () => (location.href = state.adminUrl));
  if (on) {
    addEventListener('click', edit, true);
    addEventListener('mousemove', hover, { passive: true });
    refreshContent();
  } else {
    removeEventListener('click', edit, true);
    removeEventListener('mousemove', hover);
    state.hl.style.display = 'none';
    closePop();
  }
}

/** Shows the organiser bar if the signed-in person is an editor (or above). */
export async function startEditor({ adminUrl, wantEdit }) {
  if (state) return;
  const sb = await getClient();
  const { data } = await sb.auth.getSession();
  const email = data.session?.user?.email?.toLowerCase();
  if (!email) return;
  const { data: staff } = await sb.from('staff').select('role').eq('email', email).maybeSingle();
  if (!staff || !['owner', 'admin', 'editor'].includes(staff.role)) return;
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  const bar = document.createElement('div');
  bar.className = 'pfe-bar';
  const hl = document.createElement('div');
  hl.className = 'pfe-hl';
  hl.style.display = 'none';
  hl.appendChild(document.createElement('span'));
  document.body.append(bar, hl);
  state = { email, bar, hl, pop: null, on: false, adminUrl };
  addEventListener('keydown', (k) => k.key === 'Escape' && closePop());
  setEditing(!!wantEdit);
}
