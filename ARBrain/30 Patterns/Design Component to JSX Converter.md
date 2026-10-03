---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/tooling
  - claude-design
status: proven
---

# Design Component to JSX Converter

> A Node script that converts "Design Components" — HTML templates with `{{ holes }}`, `<sc-for>`, `<sc-if>`, `<dc-import>` and a logic class — into React components, keeping the logic class as-is so every tab, filter and wizard behaves like the prototype.

**Used in:** Turning the Claude Design handoff (`design/site/*.dc.html`) into React screens (`src/screens/*.jsx`).

## How it works

- Parses each `.dc.html` with parse5.
- Converts inline styles to objects (`sx()` for dynamic ones), hover styles to pseudo CSS, loops and conditions to JSX.
- Writes `src/screens/<Name>.jsx` and `pages.json` (titles, page CSS, default props).
- Runtime helpers in `src/dc/runtime.js` (`defineDC`, `DCLogic`, `txt`, `sx`, `list`).

## Reuse it

- Run `node scripts/dc-to-jsx.mjs` after replacing `design/site/`. It overwrites `src/screens/` — re-apply hand edits after.

## Gotchas and lessons

- Screens render client-only (`ssr: false`) because the design logic reads `window`.

## Related

[[Playbook - New Web App from a Claude Design Handoff]] · [[ISE Architecture]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `scripts/dc-to-jsx.mjs`
```js
#!/usr/bin/env node
// Converts the Claude Design "Design Component" files in design/site/*.dc.html
// into React components in src/screens/*.jsx.
//
// Each .dc.html file holds an HTML template (inside <x-dc>) and a logic class
// (<script data-dc-script>). The prototype renders them at runtime with
// design/site/support.js. This script applies the same rules at build time and
// writes plain JSX, so the screens render exactly like the prototype:
//   {{ path }}        → v.path (optional chaining, like the runtime's resolver)
//   <sc-for>          → list.map(...)
//   <sc-if>           → cond ? ... : null
//   <dc-import>       → <OtherScreen ... />
//   style="a:b"       → style objects (same parser as the runtime)
//   style-hover="…"   → generated :hover classes in src/app/dc-pseudo.css
//   <helmet>          → page metadata (title, CSS) in src/screens/pages.js
//
// Usage: node scripts/dc-to-jsx.mjs
// Re-running overwrites src/screens/*.jsx, so re-apply any hand edits afterwards.

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { parse, parseFragment } from 'parse5';

const SRC = 'design/site';
const OUT = 'src/screens';

// Prototype file → route. Hrefs and string literals in logic are rewritten with this.
export const ROUTES = {
  'Home': '/',
  'Hall 2 Digital Twin': '/explore',
  'Zone Experiences': '/zones',
  'Exhibit': '/exhibit',
  'Attend and My Expo': '/attend',
  'Connect': '/connect',
  'Programme and Watch': '/programme',
  'Exhibitor Portal': '/portal',
  'Admin Console': '/admin',
  'Mobile App': '/mobile',
  'Design System': '/design-system',
};
const compName = (dcName) => dcName.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ').map((w) => w[0].toUpperCase() + w.slice(1)).join('');

// In logic code, a quoted link like 'Exhibit.dc.html#products' becomes withBase('/exhibit#products').
function rewriteLogicLinks(code) {
  return code.replace(/'([A-Za-z0-9%]+)\.dc\.html([^']*)'/g, (m, enc, rest) => {
    const route = ROUTES[decodeURIComponent(enc)];
    return route === undefined ? m : "withBase('" + route + rest + "')";
  });
}

function rewriteLinks(text) {
  return text.replace(/([A-Za-z0-9%]+?(?:%20[A-Za-z0-9]+)*)\.dc\.html/g, (m, enc) => {
    const name = decodeURIComponent(enc);
    return ROUTES[name] ?? m;
  });
}

// ---- runtime-equivalent helpers (copied semantics from support.js) ----
const CAMEL_ATTR = 'sc-camel-';
const RAW_WRAP = { select: 'sc-raw-select', table: 'sc-raw-table', tbody: 'sc-raw-tbody', thead: 'sc-raw-thead', tfoot: 'sc-raw-tfoot', tr: 'sc-raw-tr', td: 'sc-raw-td', th: 'sc-raw-th', caption: 'sc-raw-caption' };
const RAW_UNWRAP = Object.fromEntries(Object.entries(RAW_WRAP).map(([k, v]) => [v, k]));
const EVENT_MAP = { onclick: 'onClick', onchange: 'onChange', oninput: 'onInput', onsubmit: 'onSubmit', onkeydown: 'onKeyDown', onkeyup: 'onKeyUp', onkeypress: 'onKeyPress', onmousedown: 'onMouseDown', onmouseup: 'onMouseUp', onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave', onfocus: 'onFocus', onblur: 'onBlur', ondoubleclick: 'onDoubleClick', oncontextmenu: 'onContextMenu', onmousemove: 'onMouseMove', onmouseover: 'onMouseOver', onmouseout: 'onMouseOut', onpointerdown: 'onPointerDown', onpointerup: 'onPointerUp', onpointermove: 'onPointerMove', onpointerenter: 'onPointerEnter', onpointerleave: 'onPointerLeave', ontouchstart: 'onTouchStart', ontouchend: 'onTouchEnd', ontouchmove: 'onTouchMove', ondragstart: 'onDragStart', ondragend: 'onDragEnd', ondragenter: 'onDragEnter', ondragleave: 'onDragLeave', ondragover: 'onDragOver', ondrop: 'onDrop', onanimationend: 'onAnimationEnd', ontransitionend: 'onTransitionEnd' };
const ATTRS = `(?:[^>"']|"[^"]*"|'[^']*')*`;
const IMPORT_SELF_CLOSE_RE = new RegExp('<(x-import|dc-import)(' + ATTRS + ')/>', 'gi');
const CAMEL_ATTR_RE = /(\s)([a-z]+[A-Z][A-Za-z0-9]*)(\s*=)/g;
function encodeCase(html) {
  html = html.replace(IMPORT_SELF_CLOSE_RE, (_, t, a) => '<' + t + a + '></' + t + '>');
  html = html.replace(/<helmet(\s|>)/gi, '<sc-helmet$1');
  html = html.replace(/<\/helmet\s*>/gi, '</sc-helmet>');
  html = html.replace(CAMEL_ATTR_RE, (_, sp, name, eq) => sp + CAMEL_ATTR + name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) + eq);
  for (const [real, alias] of Object.entries(RAW_WRAP)) html = html.replace(new RegExp('(</?)' + real + '(?=[\\s>])', 'gi'), '$1' + alias);
  return html;
}
const kebabToCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
function cssToObj(css) {
  const o = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return o;
}
function importantify(css) {
  return css.split(';').map((d) => d.trim()).filter(Boolean).map((d) => (/!\s*important$/i.test(d) ? d : d + ' !important')).join(';');
}

// ---- expression translation (mirrors resolve() in support.js) ----
const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*/;
const NUMBER_RE = /^-?\d+(\.\d+)?$/;
const RESERVED = new Set('v React Fragment txt sx val chk hostStyle break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof new return super switch this throw try typeof var void while with yield let static enum await implements package protected interface private public null true false undefined'.split(' '));
const local = (name) => (RESERVED.has(name) ? '_' + name : name);

function parensWrapWhole(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length - 1; i++) {
    if (expr[i] === '(') depth++;
    else if (expr[i] === ')') { depth--; if (depth === 0) return false; }
  }
  return true;
}
function findTopLevelEquality(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (depth === 0 && (c === '=' || c === '!') && expr[i + 1] === '=') {
      if (i > 0 && (expr[i - 1] === '=' || expr[i - 1] === '!')) continue;
      if (!expr.slice(0, i).trim()) continue;
      const op = expr[i + 2] === '=' ? c + '==' : c + '=';
      return { index: i, op };
    }
  }
  return null;
}
function tx(src, scope) {
  const expr = String(src).trim();
  if (!expr) return 'undefined';
  if (expr[0] === '(' && expr[expr.length - 1] === ')' && parensWrapWhole(expr)) return '(' + tx(expr.slice(1, -1), scope) + ')';
  const eq = findTopLevelEquality(expr);
  if (eq) return '(' + tx(expr.slice(0, eq.index), scope) + ' ' + eq.op + ' ' + tx(expr.slice(eq.index + eq.op.length), scope) + ')';
  if (expr[0] === '!') return '!' + tx(expr.slice(1), scope);
  if (['true', 'false', 'null', 'undefined'].includes(expr)) return expr;
  if (NUMBER_RE.test(expr)) return expr;
  if (expr.length >= 2 && (expr[0] === '"' || expr[0] === "'") && expr[expr.length - 1] === expr[0]) return JSON.stringify(expr.slice(1, -1));
  return txPath(expr, scope);
}
function txPath(expr, scope) {
  const head = expr.match(IDENT_RE);
  if (!head) return 'undefined';
  let out = scope.has(head[0]) ? local(head[0]) : 'v.' + head[0];
  let i = head[0].length;
  while (i < expr.length) {
    if (expr[i] === '.') {
      const rest = expr.slice(i + 1);
      const m = rest.match(IDENT_RE) || rest.match(/^\d+/);
      if (!m) return 'undefined';
      out += /^\d/.test(m[0]) ? '?.[' + m[0] + ']' : '?.' + m[0];
      i += 1 + m[0].length;
    } else if (expr[i] === '[') {
      let depth = 1, j = i + 1;
      while (j < expr.length && depth > 0) {
        if (expr[j] === '[') depth++;
        else if (expr[j] === ']') { depth--; if (depth === 0) break; }
        j++;
      }
      if (depth !== 0) return 'undefined';
      out += '?.[' + tx(expr.slice(i + 1, j), scope) + ']';
      i = j + 1;
    } else return 'undefined';
  }
  return out;
}

const tplEsc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
// Attribute value → JS expression. kind: 'raw' | 'style'
function attrExpr(raw, scope) {
  const whole = raw.match(/^\s*\{\{([\s\S]+?)\}\}\s*$/);
  if (whole) return { dyn: true, code: tx(whole[1], scope) };
  if (raw.includes('{{')) {
    const parts = raw.split(/\{\{([\s\S]+?)\}\}/g);
    return { dyn: true, code: '`' + parts.map((s, i) => (i & 1 ? '${' + tx(s, scope) + ' ?? ""}' : tplEsc(s))).join('') + '`' };
  }
  return { dyn: false, code: JSON.stringify(raw), value: raw };
}

// ---- JSX emission ----
const VOID = new Set('area base br col embed hr img input link meta source track wbr'.split(' '));
const ATTR_MAP = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', autofocus: 'autoFocus', readonly: 'readOnly', maxlength: 'maxLength', minlength: 'minLength', colspan: 'colSpan', rowspan: 'rowSpan', frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen', crossorigin: 'crossOrigin', srcset: 'srcSet', playsinline: 'playsInline', autoplay: 'autoPlay', novalidate: 'noValidate', spellcheck: 'spellCheck', contenteditable: 'contentEditable', datetime: 'dateTime', inputmode: 'inputMode', autocomplete: 'autoComplete', referrerpolicy: 'referrerPolicy', accesskey: 'accessKey', viewbox: 'viewBox', 'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace' };
const BLOCKISH = new Set('div section header footer main nav article aside form p h1 h2 h3 h4 h5 h6 ul ol li button td th figure figcaption blockquote details summary dl dt dd fieldset legend'.split(' '));
const NO_WS = new Set('table thead tbody tfoot tr colgroup select svg g defs clippath lineargradient radialgradient mask pattern'.split(' '));

const BLOCK_TAGS = new Set('div section header footer main nav article aside form p h1 h2 h3 h4 h5 h6 ul ol li figure figcaption blockquote hr dl dt dd details summary fieldset pre sc-raw-table'.split(' '));
// Inline style with template holes masked as '@@' (whitespace removed), or null when the whole value is a hole.
function staticCss(n) {
  const st = n && n.attrs ? (n.attrs.find((a) => a.name === 'style') || {}).value : undefined;
  if (st === undefined) return '';
  if (/^\s*\{\{[\s\S]+?\}\}\s*$/.test(st)) return null;
  return st.replace(/\{\{[\s\S]+?\}\}/g, '@@').replace(/\s+/g, '');
}
// display value from staticCss: a string, undefined when not set, null when unknown.
function displayOf(n) {
  const css = staticCss(n);
  if (css === null) return null;
  const d = /(?:^|;)display:([^;]*)/.exec(css);
  if (!d) return undefined;
  return d[1].includes('@@') ? null : d[1];
}
// True when the element is certainly a block-level box (from its tag and static inline style).
function knownBlock(n) {
  if (!n || !n.tagName) return false; // text
  if (n.tagName === 'dc-import') return true; // embedded components render inside a block div
  if (n.tagName.startsWith('sc-') && !n.tagName.startsWith('sc-raw-')) return false; // loops, conditions
  const d = displayOf(n);
  if (d === null) return false;
  if (d !== undefined) return ['block', 'flex', 'grid', 'table', 'list-item'].includes(d);
  return BLOCK_TAGS.has(n.tagName);
}
const isWsOnly = (t) => /^[ \t\n\r\f]*$/.test(t);
const collapse = (t) => t.replace(/[ \t\n\r\f]+/g, ' ');
function textJsx(t) {
  if (!t) return '';
  if (t !== t.trim() || /[{}<>&]/.test(t) || /^[ \t]|[ \t]$/.test(t)) return '{' + JSON.stringify(t) + '}';
  return t;
}

class Emitter {
  constructor(name) {
    this.name = name;
    this.imports = new Set();
    this.pseudo = new Map(); // class → css rule
    this.helmet = [];
  }
  pseudoClass(pseudo, css) {
    const cls = 'scp-' + createHash('sha1').update(pseudo + '|' + css).digest('hex').slice(0, 8);
    this.pseudo.set(cls, '.' + cls + ':' + pseudo + '{' + importantify(css) + '}');
    return cls;
  }
  // children → array of JSX strings
  // parent: the enclosing DOM element (for whitespace rules); fragment: nodes are the body of an
  // <sc-for>/<sc-if>, so their first/last whitespace sits between real siblings and is kept.
  children(parent, nodes, scope, ind, fragment = false) {
    const tag = parent ? parent.tagName : null;
    const realTag = tag ? (RAW_UNWRAP[tag] || tag) : null;
    const inOption = !!parent && parent.tagName === 'option';
    const pd = parent ? displayOf(parent) : undefined;
    const flexy = typeof pd === 'string' && /^(inline-)?(flex|grid)$/.test(pd);
    const displayInline = pd === null || (typeof pd === 'string' && pd.startsWith('inline') && !flexy);
    const blockish = !fragment && ((realTag && BLOCKISH.has(realTag) && !displayInline) || flexy || !parent);
    const noWs = flexy || (realTag && NO_WS.has(realTag.toLowerCase()));
    const kept = nodes.filter((n) => n.nodeName !== '#comment' && !(n.nodeName === '#text' && !n.value.trim() && !n.value.includes(' ')) && n.tagName !== 'sc-helmet');
    // Helmets are collected separately.
    for (const n of nodes) if (n.tagName === 'sc-helmet') this.helmet.push(n);
    const out = [];
    // A whitespace run next to a block-level box starts or ends a line, so CSS collapses it away.
    // Edges count as block only when they are the real start/end of a block container.
    const sideBlock = (n) => (n === undefined ? blockish : knownBlock(n));
    kept.forEach((n, idx) => {
      const prevB = sideBlock(kept[idx - 1]), nextB = sideBlock(kept[idx + 1]);
      if (n.nodeName === '#text') {
        const raw = n.value;
        if (!raw.includes('{{')) {
          if (!raw.trim()) {
            if (noWs || prevB || nextB) return;
            out.push(ind + '{" "}');
            return;
          }
          let t = collapse(raw);
          if (flexy) t = t.trim();
          else {
            if (prevB) t = t.trimStart();
            if (nextB) t = t.trimEnd();
          }
          if (t) out.push(ind + textJsx(t));
          return;
        }
        const parts = raw.split(/\{\{([\s\S]+?)\}\}/g);
        const segs = [];
        parts.forEach((p, i) => {
          // <option> may only contain text, so holes there render as plain strings.
          if (i & 1) { segs.push((inOption ? '{str(' : '{txt(') + tx(p, scope) + ')}'); return; }
          let t = collapse(p);
          if (flexy) t = t.trim();
          else {
            if (prevB && i === 0) t = t.trimStart();
            if (nextB && i === parts.length - 1) t = t.trimEnd();
          }
          if (t) segs.push(textJsx(t));
        });
        if (segs.length) out.push(ind + segs.join(''));
        return;
      }
      if (n.tagName) out.push(...this.element(n, scope, ind, parent));
    });
    return out;
  }
  element(el, scope, ind, parent) {
    const tag = el.tagName;
    const attr = (name) => (el.attrs.find((a) => a.name === name) || {}).value;
    if (tag === 'sc-for') {
      const list = attrExpr(attr('list') || '', scope);
      const as = attr('as') || 'item';
      const inner = new Set(scope); inner.add(as); inner.add('$index');
      const kids = this.children(parent, el.childNodes, inner, ind + '    ', true);
      return [
        ind + '{list(' + list.code + ').map((' + local(as) + ', $index) => (',
        ind + '  <Fragment key={$index}>',
        ...kids,
        ind + '  </Fragment>',
        ind + '))}',
      ];
    }
    if (tag === 'sc-if') {
      const cond = attrExpr(attr('value') || '', scope);
      const kids = this.children(parent, el.childNodes, scope, ind + '    ', true);
      return [ind + '{' + cond.code + ' ? (', ind + '  <>', ...kids, ind + '  </>', ind + ') : null}'];
    }
    if (tag === 'dc-import') {
      const name = attr('name') || attr('component') || '';
      const C = compName(name);
      this.imports.add(C);
      const props = [];
      for (const { name: an, value } of el.attrs) {
        if (an === 'name' || an === 'component' || an === 'hint-size') continue;
        let key = an.startsWith(CAMEL_ATTR) ? kebabToCamel(an.slice(CAMEL_ATTR.length)) : an;
        if (an === 'style') {
          props.push('__hostStyle={hostStyle(' + attrExpr(value, scope).code + ')}');
          continue;
        }
        if (key.includes('-')) key = kebabToCamel(key);
        const e = attrExpr(value, scope);
        props.push(key === 'dcProps' ? '{...' + e.code + '}' : key + '={' + e.code + '}');
      }
      return [ind + '<' + C + (props.length ? ' ' + props.join(' ') : '') + ' />'];
    }
    if (tag === 'x-import') throw new Error('x-import is not supported');
    return this.dom(el, scope, ind);
  }
  dom(el, scope, ind) {
    const realTag = RAW_UNWRAP[el.tagName] || el.tagName;
    const custom = realTag.includes('-');
    const props = [];
    const classes = [];
    const has = (n) => el.attrs.some((a) => a.name === n || a.name === CAMEL_ATTR + n.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()));
    const controlled = has('onChange') || has('onchange') || has('onInput') || has('oninput');
    for (const { name, value } of el.attrs) {
      let key = name.startsWith(CAMEL_ATTR) ? kebabToCamel(name.slice(CAMEL_ATTR.length)) : name;
      if (key.startsWith('style-')) { classes.push(JSON.stringify(this.pseudoClass(key.slice(6), value))); continue; }
      if (key === 'class') { classes.unshift(attrExpr(value, scope).code); continue; }
      if (key.startsWith('on')) key = EVENT_MAP[key.toLowerCase()] || key;
      else if (!custom) {
        key = ATTR_MAP[key] || key;
        if (key.includes('-') && !key.startsWith('data-') && !key.startsWith('aria-')) key = kebabToCamel(key);
      }
      if (key === 'style') {
        const e = attrExpr(value, scope);
        if (!e.dyn) {
          const obj = cssToObj(value);
          const body = Object.entries(obj).map(([k, v]) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ': ' + JSON.stringify(v)).join(', ');
          props.push('style={{ ' + body + ' }}');
        } else props.push('style={sx(' + e.code + ')}');
        continue;
      }
      const e = attrExpr(value, scope);
      if ((key === 'href' || key === 'src') && !e.dyn && !/^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(e.value)) {
        // Site paths get the deployment's base path (GitHub Pages serves the site under /<repo>).
        props.push(key + '={withBase(' + JSON.stringify(e.value.startsWith('/') ? e.value : '/' + e.value) + ')}');
        continue;
      }
      if (key === 'autoFocus') { props.push(e.dyn ? 'autoFocus={' + e.code + '}' : 'autoFocus'); continue; }
      if ((key === 'value' || key === 'checked') && !e.dyn && !controlled) {
        props.push((key === 'value' ? 'defaultValue' : 'defaultChecked') + '={' + e.code + '}');
        continue;
      }
      if (key === 'value' && e.dyn) { props.push('value={val(' + e.code + ')}'); continue; }
      if (key === 'checked' && e.dyn) { props.push('checked={chk(' + e.code + ')}'); continue; }
      props.push(key + (e.dyn ? '={' + e.code + '}' : '=' + (/["\\{}&]/.test(e.value) || /\n/.test(e.value) ? '{' + e.code + '}' : '"' + e.value + '"')));
    }
    if (classes.length) props.unshift('className=' + (classes.length === 1 && classes[0].startsWith('"') ? classes[0] : '{[' + classes.join(', ') + '].filter(Boolean).join(" ")}'));
    if (realTag === 'textarea') {
      const text = el.childNodes.filter((n) => n.nodeName === '#text').map((n) => n.value).join('').replace(/^\n/, '');
      if (text.includes('{{')) {
        // Bound content: show it as the initial value and reset when it changes. (The prototype
        // runtime passed an element here and the textarea showed "[object Object]".)
        const parts = text.split(/\{\{([\s\S]+?)\}\}/g);
        const code = '`' + parts.map((s, i) => (i & 1 ? '${str(' + tx(s, scope) + ')}' : tplEsc(s))).join('') + '`';
        const bare = parts.length === 3 && !parts[0].trim() && !parts[2].trim();
        const value = bare ? 'str(' + tx(parts[1], scope) + ')' : code;
        props.push('key={' + value + '}', 'defaultValue={' + value + '}');
      } else if (text) props.push('defaultValue={' + JSON.stringify(text) + '}');
      return [ind + '<textarea' + (props.length ? ' ' + props.join(' ') : '') + ' />'];
    }
    const open = '<' + realTag + (props.length ? ' ' + props.join(' ') : '');
    if (VOID.has(realTag)) return [ind + open + ' />'];
    const kids = this.children(el, el.childNodes, scope, ind + '  ');
    if (!kids.length) return [ind + open + ' />'];
    if (kids.length === 1 && kids[0].trim().length + open.length + realTag.length < 160 && !kids[0].trim().startsWith('<') && !kids[0].trim().startsWith('{list(')) {
      return [ind + open + '>' + kids[0].trim() + '</' + realTag + '>'];
    }
    return [ind + open + '>', ...kids, ind + '</' + realTag + '>'];
  }
}

// ---- file processing ----
function findAll(node, pred, acc = []) {
  if (pred(node)) acc.push(node);
  for (const c of node.childNodes || []) findAll(c, pred, acc);
  if (node.content) findAll(node.content, pred, acc);
  return acc;
}
const textOf = (n) => (n.childNodes || []).map((c) => c.value || '').join('');

function convert(file) {
  const src = readFileSync(join(SRC, file), 'utf8');
  const dcName = file.replace(/\.dc\.html$/, '');
  const C = compName(dcName);
  const openMatch = /<x-dc(?:\s[^>]*)?>/.exec(src);
  const close = src.lastIndexOf('</x-dc>');
  const template = rewriteLinks(src.slice(openMatch.index + openMatch[0].length, close));
  const doc = parse(src);
  const script = findAll(doc, (n) => n.tagName === 'script' && n.attrs.some((a) => a.name === 'data-dc-script'))[0];
  const logic = script ? rewriteLogicLinks(textOf(script)).trim() : '';
  const propsRaw = script ? (script.attrs.find((a) => a.name === 'data-props') || {}).value : null;
  let defaults = {};
  if (propsRaw) {
    const p = JSON.parse(propsRaw);
    for (const k of Object.keys(p)) if (k[0] !== '$' && p[k] && p[k].default !== undefined) defaults[k] = p[k].default;
  }

  const em = new Emitter(dcName);
  const frag = parseFragment(encodeCase(template));
  const body = em.children(null, frag.childNodes, new Set(), '      ');

  // Helmet → metadata
  const meta = { title: '', css: '', scripts: [], links: [] };
  for (const h of em.helmet) {
    for (const c of h.childNodes) {
      if (!c.tagName) continue;
      if (c.tagName === 'title') meta.title = textOf(c);
      else if (c.tagName === 'style') meta.css += textOf(c);
      else if (c.tagName === 'script') meta.scripts.push((c.attrs.find((a) => a.name === 'src') || {}).value);
      else if (c.tagName === 'link') meta.links.push((c.attrs.find((a) => a.name === 'href') || {}).value);
    }
  }
  const usesMap = meta.scripts.some((s) => /maplibre/.test(s));
  const usesHeroFit = meta.scripts.some((s) => /hero-fit/.test(s));

  const lines = [];
  lines.push(`'use client';`);
  lines.push(`// Generated from design/site/${file} by scripts/dc-to-jsx.mjs.`);
  lines.push(`// Logic class and template are carried over from the design unchanged; links point at app routes.`);
  lines.push(`import React, { Fragment } from 'react';`);
  lines.push(`import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';`);
  lines.push(`import { withBase } from '@/lib/base';`);
  lines.push(`import '@/data/ise';`);
  if (usesMap) lines.push(`import '@/lib/maplibre';`);
  if (usesHeroFit) lines.push(`import '@/lib/hero-fit';`);
  for (const imp of em.imports) lines.push(`import ${imp} from './${imp}';`);
  lines.push('');
  if (logic) {
    lines.push(`/* global maplibregl */`);
    lines.push(logic);
  } else {
    lines.push(`class Component extends DCLogic {}`);
  }
  lines.push('');
  lines.push(`function render(v) {`);
  lines.push(`  return (`);
  lines.push(`    <>`);
  lines.push(...body);
  lines.push(`    </>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push('');
  lines.push(`export default defineDC(${JSON.stringify(dcName)}, Component, render);`);
  lines.push('');
  writeFileSync(join(OUT, C + '.jsx'), lines.join('\n'));
  return { dcName, C, meta, defaults, pseudo: em.pseudo, route: ROUTES[dcName] };
}

mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC).filter((f) => f.endsWith('.dc.html')).sort();
const results = files.map(convert);

const pseudo = new Map();
for (const r of results) for (const [k, v] of r.pseudo) pseudo.set(k, v);
writeFileSync('src/app/dc-pseudo.css', '/* Generated by scripts/dc-to-jsx.mjs from style-hover attributes. */\n' + [...pseudo.values()].join('\n') + '\n');

const pages = results.filter((r) => r.route).map((r) => ({ route: r.route, component: r.C, title: r.meta.title, css: r.meta.css, defaults: r.defaults }));
const shared = results.filter((r) => !r.route).map((r) => ({ component: r.C, css: r.meta.css }));
writeFileSync(join(OUT, 'pages.json'), JSON.stringify({ pages, shared }, null, 2) + '\n');
for (const r of results) console.log(`${r.dcName} → ${OUT}/${r.C}.jsx${r.route ? '  (' + r.route + ')' : ''}`);

// Client-only loaders for each routed screen (the design logic reads window, so screens render in the browser).
const loaders = [
  `'use client';`,
  `// Generated by scripts/dc-to-jsx.mjs.`,
  `import dynamic from 'next/dynamic';`,
  ``,
  `export const SCREENS = {`,
  ...pages.map((p) => `  ${JSON.stringify(p.route)}: dynamic(() => import('./${p.component}'), { ssr: false }),`),
  `};`,
  ``,
];
writeFileSync(join(OUT, 'index.js'), loaders.join('\n'));
```

#### `src/dc/runtime.js`
```js
'use client';
// Runtime for the screens generated from the Claude Design components.
// It keeps the design's component model: each screen has a logic class
// (state, lifecycle, renderVals()) and a render(v) template, where `v` is the
// screen's props merged with renderVals(). The behaviour matches
// design/site/support.js, minus the editor and streaming features.

import React from 'react';

/** Base class for screen logic. Same API as the prototype's DCLogic. */
export class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this.__host = null;
  }
  setState(update, cb) {
    if (this.__host) this.__host.__setLogicState(update, cb);
  }
  forceUpdate() {
    if (this.__host) this.__host.forceUpdate();
  }
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  renderVals() {
    return {};
  }
}

const kebabToCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/** CSS declaration string → React style object (same parser as the prototype). */
export function cssToObj(css) {
  const o = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return o;
}

/** Style value from a template hole: strings are parsed, objects pass through. */
export function sx(style) {
  return typeof style === 'string' ? cssToObj(style) : style;
}

/** Text hole: elements render as-is, scalars as <span class="sc-interp">, null/boolean/undefined as nothing. */
export function txt(value) {
  if (value === undefined || value === null || typeof value === 'boolean') return null;
  if (React.isValidElement(value) || Array.isArray(value)) return value;
  return <span className="sc-interp">{String(value)}</span>;
}

/** Text hole where only text is allowed (inside <option>). */
export function str(value) {
  return value === undefined || value === null || typeof value === 'boolean' ? '' : String(value);
}

/** List for a loop: anything that is not an array renders nothing. */
export function list(value) {
  return Array.isArray(value) ? value : [];
}

/** Controlled input value / checked: undefined becomes '' / false. */
export const val = (v) => (v === undefined ? '' : v);
export const chk = (v) => (v === undefined ? false : v);

const HOST_STYLE_PROPS = new Set(['position', 'left', 'right', 'top', 'bottom', 'inset', 'width', 'height', 'z-index', 'transform']);

/** Position-related subset of a style, applied to an embedded component's host element. */
export function hostStyle(style) {
  const all = typeof style === 'string' ? cssToObj(style) : style && typeof style === 'object' ? style : null;
  if (!all) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(all)) {
    if (HOST_STYLE_PROPS.has(k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()))) out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

function userProps(props) {
  const { __hostStyle, ...rest } = props;
  return rest;
}

/**
 * Wraps a logic class and a template into a React component. Like the
 * prototype, the output sits inside <div class="sc-host">.
 */
export function defineDC(name, Logic, render) {
  class DC extends React.Component {
    constructor(props) {
      super(props);
      this.state = { v: 0, err: null };
      this.logic = new (Logic || DCLogic)(userProps(props));
      this.logic.__host = this;
    }
    static getDerivedStateFromError(e) {
      return { err: e instanceof Error && e.message ? e.message : String(e) };
    }
    componentDidCatch(e, info) {
      console.error('[' + name + '] render error:', e, info && info.componentStack);
    }
    __setLogicState(update, cb) {
      const prev = this.logic.state;
      const patch = typeof update === 'function' ? update(prev) : update;
      this.logic.state = { ...prev, ...patch };
      this.setState((s) => ({ v: s.v + 1 }), cb);
    }
    componentDidMount() {
      try {
        this.logic.componentDidMount();
      } catch (e) {
        console.error(e);
      }
    }
    componentDidUpdate(prevProps) {
      this.logic.props = userProps(this.props);
      try {
        this.logic.componentDidUpdate(prevProps);
      } catch (e) {
        console.error(e);
      }
    }
    componentWillUnmount() {
      try {
        this.logic.componentWillUnmount();
      } catch (e) {
        console.error(e);
      }
    }
    render() {
      const host = { className: 'sc-host', style: this.props.__hostStyle, 'data-sc-name': name };
      if (this.state.err) {
        return (
          <div {...host}>
            <div className="sc-error">{name + ': ' + this.state.err}</div>
          </div>
        );
      }
      const props = userProps(this.props);
      this.logic.props = props;
      let vals = props;
      let err = null;
      try {
        vals = { ...props, ...(this.logic.renderVals() || {}) };
      } catch (e) {
        console.error(e);
        err = name + '.renderVals(): ' + (e instanceof Error && e.message ? e.message : String(e));
      }
      return (
        <div {...host}>
          {err ? <div className="sc-error">{err}</div> : null}
          {render(vals)}
        </div>
      );
    }
  }
  DC.displayName = name.replace(/\s+/g, '');
  return DC;
}
```
