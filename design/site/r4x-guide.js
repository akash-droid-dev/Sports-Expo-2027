// R-4X — wandering Expo guide. Drop <script src="r4x-guide.js"></script> on any page.
(function () {
  if (window.__r4x) return; window.__r4x = true;
  const SIZE = 150, PAD = 16, TOP_SAFE = 72;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = `
  #r4x-bot{position:fixed;left:0;top:0;width:${SIZE}px;height:${SIZE}px;z-index:9000;will-change:transform;}
  #r4x-crop{position:absolute;inset:0;overflow:hidden;pointer-events:none}
  #r4x-bot iframe{position:absolute;left:0;top:0;width:1200px;height:800px;border:0;background:transparent;pointer-events:none;color-scheme:normal;transform-origin:0 0;transform:translate(-162px,-120px) scale(.4)}
  #r4x-bot button.r4x-hit{position:absolute;inset:14%;border:0;background:transparent;border-radius:50%;cursor:pointer;padding:0}
  #r4x-bot button.r4x-hit:focus-visible{outline:2px solid #F07C12;outline-offset:4px}
  #r4x-tip{position:absolute;left:50%;bottom:100%;transform:translate(-50%,4px);background:#0E0E0F;color:#fff;font:700 11px/1 'Instrument Sans',sans-serif;letter-spacing:.1em;padding:8px 10px;white-space:nowrap;opacity:0;transition:opacity .2s,transform .2s;pointer-events:none}
  #r4x-bot:hover #r4x-tip,#r4x-bot.r4x-hello #r4x-tip{opacity:1;transform:translate(-50%,-2px)}
  #r4x-panel{position:fixed;z-index:9001;width:min(380px,calc(100vw - 24px));max-height:min(560px,calc(100vh - 100px));background:#fff;color:#0E0E0F;border:1px solid #0E0E0F;box-shadow:0 24px 60px -24px rgba(14,14,15,.55);display:none;flex-direction:column;font-family:'Instrument Sans',sans-serif}
  #r4x-panel.open{display:flex}
  #r4x-panel header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#0E0E0F;color:#fff}
  #r4x-panel header b{font-family:'Archivo',sans-serif;font-stretch:62%;font-weight:900;font-size:24px;letter-spacing:.01em}
  #r4x-panel header span{font:500 10px 'JetBrains Mono',monospace;letter-spacing:.16em;color:#F07C12;display:flex;gap:6px;align-items:center}
  #r4x-panel header span i{width:7px;height:7px;border-radius:50%;background:#0B6E4F;display:inline-block}
  #r4x-panel header button{border:1px solid #3A3A3E;background:none;color:#fff;height:28px;padding:0 10px;font:700 11px 'Instrument Sans';cursor:pointer}
  #r4x-log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:12px;min-height:160px}
  .r4x-m{display:flex;flex-direction:column;gap:5px;max-width:90%}
  .r4x-m small{font:500 10px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#C2610B}
  .r4x-m p{margin:0;font-size:14px;line-height:1.5;white-space:pre-wrap}
  .r4x-me{align-self:flex-end}.r4x-me small{color:#8A877F;text-align:right}.r4x-me p{background:#0E0E0F;color:#fff;padding:9px 12px}
  .r4x-links{display:flex;flex-wrap:wrap;gap:6px}
  .r4x-links a{height:30px;padding:0 10px;background:#F07C12;color:#0E0E0F;text-decoration:none;display:flex;align-items:center;font:700 11px 'Instrument Sans';letter-spacing:.08em}
  .r4x-busy{font:500 11px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#C2610B}
  #r4x-sug{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}
  #r4x-sug button{height:30px;padding:0 10px;border:1px solid #E3E0D8;background:#fff;font:500 12px 'Instrument Sans';cursor:pointer;color:#0E0E0F}
  #r4x-sug button:hover{border-color:#F07C12;color:#C2610B}
  #r4x-form{display:flex;border-top:1px solid #0E0E0F}
  #r4x-form input{flex:1;height:50px;border:0;padding:0 14px;font:15px 'Instrument Sans',sans-serif;outline:none;min-width:0}
  #r4x-form button{width:84px;border:0;background:#F07C12;color:#0E0E0F;font:700 12px 'Instrument Sans';letter-spacing:.1em;cursor:pointer}
  #r4x-panel footer{padding:6px 14px 10px;font-size:11px;color:#8A877F}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const bot = document.createElement('div'); bot.id = 'r4x-bot';
  bot.innerHTML = `<div id="r4x-crop"></div><span id="r4x-tip">ASK R-4X</span><button class="r4x-hit" aria-label="Ask R-4X, the Expo guide" aria-expanded="false" aria-controls="r4x-panel"></button>`;
  const panel = document.createElement('div'); panel.id = 'r4x-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Ask R-4X');
  panel.innerHTML = `<header><div style="display:flex;flex-direction:column;gap:3px"><span><i></i>EXPO GUIDE · ONLINE</span><b>ASK R-4X</b></div><button type="button" data-close>CLOSE ✕</button></header>
    <div id="r4x-log" role="log" aria-live="polite"></div>
    <div id="r4x-sug"></div>
    <form id="r4x-form"><input aria-label="Ask anything about the Expo" placeholder="Ask anything about the Expo…" autocomplete="off"><button type="submit">ASK →</button></form>
    <footer>Demo assistant · answers use sample Expo data</footer>`;
  const mount = () => { document.body.appendChild(bot); document.body.appendChild(panel); };
  const loadScene = () => { const f = document.createElement('iframe'); f.src = (window.__resources && window.__resources.r4xScene) || 'r4x-scene.html'; f.title = ''; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; bot.querySelector('#r4x-crop').appendChild(f); };
  document.readyState === 'complete' ? setTimeout(loadScene, 800) : addEventListener('load', () => setTimeout(loadScene, 800), { once: true });
  document.body ? mount() : addEventListener('DOMContentLoaded', mount);

  const log = panel.querySelector('#r4x-log'), input = panel.querySelector('input'), hit = bot.querySelector('.r4x-hit');
  const add = (me, text, links) => {
    const d = document.createElement('div'); d.className = 'r4x-m' + (me ? ' r4x-me' : '');
    d.innerHTML = `<small>${me ? 'YOU' : 'R-4X'}</small><p></p>`; d.querySelector('p').textContent = text;
    if (links && links.length) { const l = document.createElement('div'); l.className = 'r4x-links'; links.forEach(k => { const a = document.createElement('a'); a.href = k.href; a.textContent = k.t; l.appendChild(a); }); d.appendChild(l); }
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  };
  add(false, 'Namaste. I am R-4X, your guide to India Sports Expo 2027 in Hall 2, Yashobhoomi. Ask me anything: exhibitors, stalls, sessions, meetings, routes or travel.');
  const SUG = ['Where is Apex Sports?', 'What is live now?', 'How do I book a stall?', 'How do I get there?', 'Find me buyers'];
  const sug = panel.querySelector('#r4x-sug');
  SUG.forEach(t => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.onclick = () => ask(t); sug.appendChild(b); });

  function local(q) {
    const D = window.ISE; const t = q.toLowerCase();
    if (D) {
      const ex = D.exhibitors.find(e => t.includes(e.name.toLowerCase().split(' ')[0]) || t.includes(e.stall.toLowerCase()));
      if (ex) return { text: `${ex.name} is at stall ${ex.stall}, Zone ${ex.zone} (${D.cl(ex.cluster).name}). From the Main Entrance follow the Sports Boulevard into Zone ${ex.zone}, about 4 minutes on foot. They offer ${ex.products.slice(0, 3).join(', ')} and are looking for ${ex.seeking}.`, links: [{ t: 'NAVIGATE', href: 'Hall%202%20Digital%20Twin.dc.html' }, { t: 'BOOK MEETING', href: 'Connect.dc.html#meetings' }] };
      if (/live|now|watch|stream/.test(t)) { const s = D.sessions.find(x => x.status === 'live'); return { text: `Live now in the ${s.stage}: “${s.title}”, ${s.time}–${s.end}. Up next: ${D.sessions.filter(x => x.day === 2 && x.status === 'upcoming').slice(0, 2).map(x => x.time + ' ' + x.title).join('; ')}.`, links: [{ t: 'WATCH LIVE', href: 'Programme%20and%20Watch.dc.html#watch' }] }; }
      const z = D.zones.find(z => t.includes(z.short.toLowerCase()) || t.includes('zone ' + z.id.toLowerCase()));
      if (z) return { text: `Zone ${z.id} · ${z.name}. ${z.blurb}`, links: [{ t: 'EXPLORE ZONE ' + z.id, href: 'Zone%20Experiences.dc.html' }] };
    }
    if (/register|pass|ticket|badge|accredit/.test(t)) return { text: 'Register once as a visitor, buyer, investor, media or another participant type. After verification and approval you receive accreditation and a digital pass with a QR code on the web and in the app.', links: [{ t: 'REGISTER', href: 'Attend%20and%20My%20Expo.dc.html#register' }] };
    if (/stall|booth|exhibit|space|pavilion/.test(t)) return { text: 'There are seven exhibition products, from a Standard Booth (3 × 3 m, sample) to a Hero Experience (500+ m², sample). Pick a product, then choose an available stall on the live Hall 2 inventory.', links: [{ t: 'EXHIBITION PRODUCTS', href: 'Exhibit.dc.html#products' }, { t: 'AVAILABLE STALLS', href: 'Exhibit.dc.html#inventory' }] };
    if (/metro|airport|get there|reach|parking|hotel|travel|direction/.test(t)) return { text: 'Yashobhoomi is in Dwarka Sector 25, New Delhi. The Airport Express metro line serves the venue; by car from IGI Airport is roughly 20–30 minutes (sample estimate). Shuttles run from partner hotels.', links: [{ t: 'GETTING THERE', href: 'Hall%202%20Digital%20Twin.dc.html#getting-there' }] };
    if (/buyer|match|meet|distribut|invest|partner/.test(t)) return { text: 'The India Sports Business Exchange in Zone D matches exhibitors, buyers, investors and distributors, then books a table, a time and reminders.', links: [{ t: 'FIND MATCHES', href: 'Connect.dc.html' }] };
    if (/programme|program|session|agenda|speaker/.test(t)) return { text: 'Three days across the Plenary Hall, Innovation Arena and Business Exchange Stage. You can view by agenda, timeline, stage, sector or speaker and save sessions to My Expo.', links: [{ t: 'PROGRAMME', href: 'Programme%20and%20Watch.dc.html#programme' }] };
    return null;
  }
  let busy = false;
  async function ask(q) {
    q = (q || '').trim(); if (!q || busy) return; busy = true; input.value = '';
    add(true, q);
    const b = document.createElement('div'); b.className = 'r4x-busy'; b.textContent = 'R-4X IS CHECKING HALL 2…'; log.appendChild(b); log.scrollTop = log.scrollHeight;
    let r = local(q);
    if (!r && window.claude && window.claude.complete) {
      try {
        const D = window.ISE; const ctx = D ? JSON.stringify({ zones: D.zones.map(z => z.id + ' ' + z.name), clusters: D.clusters.map(c => c.id + ' ' + c.name + ' (Zone ' + c.zone + ')'), exhibitors: D.exhibitors.map(e => e.name + ' · ' + e.stall + ' · ' + e.sector), sessions: D.sessions.map(s => 'Day ' + s.day + ' ' + s.time + ' ' + s.title + ' @ ' + s.stage) }) : '';
        const txt = await window.claude.complete(`You are R-4X, the friendly, concise guide for India Sports Expo 2027 at Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. Answer in at most 3 short sentences of plain text, no markdown. Prefer the demo data below; for anything unconfirmed say it is provisional and suggest the helpdesk. Demo data: ${ctx}\n\nVisitor: ${q}`);
        r = { text: String(txt).trim() };
      } catch (e) { r = null; }
    }
    if (!r) r = { text: 'I can help with exhibitors, stalls, sessions, live streams, registration, meetings and getting to Yashobhoomi. Try “Where is Apex Sports?”', links: [{ t: 'HELPDESK', href: 'Attend%20and%20My%20Expo.dc.html#myexpo' }] };
    b.remove(); add(false, r.text, r.links); busy = false;
  }
  panel.querySelector('#r4x-form').addEventListener('submit', e => { e.preventDefault(); ask(input.value); });

  // Stationary on the right edge, vertically low. Eyes blink inside the scene; click = jump, then open chat.
  let open = false, jumping = false;
  const pos = () => ({ x: innerWidth - SIZE - 18, y: innerHeight - SIZE - 18 });
  function place() {
    const p = pos();
    if (!jumping) bot.style.transform = `translate(${p.x}px, ${p.y}px)`;
    if (!open) return;
    const pw = panel.offsetWidth, ph = panel.offsetHeight;
    let px = Math.max(12, p.x + SIZE - pw), py = Math.max(12, p.y - ph - 8);
    panel.style.left = px + 'px'; panel.style.top = py + 'px';
  }
  place(); addEventListener('resize', place);
  function jump(done) {
    if (reduced) return done();
    jumping = true; const p = pos(); const t0 = performance.now(), D = 560;
    const step = now => {
      const k = Math.min(1, (now - t0) / D);
      const h = Math.sin(k * Math.PI) * 46;
      const sq = k < 0.12 ? 1 - k * 0.9 : k > 0.88 ? 1 - (1 - k) * 0.9 : 1;
      bot.style.transform = `translate(${p.x}px, ${p.y - h}px) scale(${2 - sq}, ${sq})`;
      if (k < 1) requestAnimationFrame(step); else { jumping = false; place(); done(); }
    };
    bot.style.transformOrigin = '50% 100%';
    requestAnimationFrame(step);
  }
  function setOpen(v) { open = v; panel.classList.toggle('open', v); hit.setAttribute('aria-expanded', String(v)); if (v) { place(); setTimeout(() => input.focus(), 30); } }
  hit.addEventListener('click', () => { if (jumping) return; if (open) return setOpen(false); jump(() => setOpen(true)); });
  panel.querySelector('[data-close]').addEventListener('click', () => setOpen(false));
  addEventListener('keydown', e => { if (e.key === 'Escape' && open) setOpen(false); });
  setTimeout(() => { bot.classList.add('r4x-hello'); setTimeout(() => bot.classList.remove('r4x-hello'), 3200); }, 2500);
})();
