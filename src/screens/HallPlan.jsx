'use client';
// Generated from design/site/Hall Plan.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import '@/data/ise';

/* global maplibregl */
class Component extends DCLogic {
  componentDidMount() { if (!window.ISE) { this._t = setInterval(() => { if (window.ISE) { clearInterval(this._t); this.forceUpdate(); } }, 60); } }
  componentWillUnmount() { clearInterval(this._t); }
  status(id, i) {
    let h = 0; const s = id + i; for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) % 997;
    if (this.props.forceAvail && this.props.forceAvail.includes(id + '-' + String(i + 1).padStart(3, '0'))) return 'available';
    if (h % 20 === 0) return 'blocked';
    if (h % 10 < 3) return 'allocated';
    if (h % 10 < 5) return 'reserved';
    return h % 10 < 7 ? 'allocated' : 'available';
  }
  renderVals() {
    const D = window.ISE; const p = this.props;
    const iso = !!p.iso, mode = p.mode || 'zones', active = p.activeZone || null;
    const lit = p.lit || ['A', 'B', 'C', 'D'];
    const roof = p.roof ?? 0;
    const sel = p.selectedCluster, selStall = p.selectedStall;
    const planStyle = { position: 'relative', width: '100%', aspectRatio: '2 / 1', transformStyle: 'preserve-3d', transition: 'transform 1.4s cubic-bezier(.2,.7,.2,1)', transform: iso ? 'rotateX(52deg) rotateZ(-28deg) scale(0.78) translateY(-4%)' : 'none', marginBottom: '4.5%' };
    const roofStyle = { position: 'absolute', inset: '-0.5%', background: '#1A1A1C', opacity: roof, transition: 'opacity 1s ease, transform 1.2s ease', transform: iso ? `translateZ(${40 + roof * 30}px)` : 'none', pointerEvents: roof > 0.5 ? 'auto' : 'none', boxShadow: iso ? '0 40px 80px rgba(0,0,0,.25)' : 'none' };
    if (!D) return { planStyle, roofStyle, items: [], zoneLabels: [], cargo: [], pins: [] };
    const STAT = {
      available: { background: '#FFFFFF', border: '1px solid #0B6E4F' },
      reserved: { background: 'repeating-linear-gradient(45deg,#F07C12 0 2px,#FFF3E6 2px 5px)', border: '1px solid #C2610B' },
      allocated: { background: '#3A3A3E', border: '1px solid #3A3A3E' },
      blocked: { background: 'repeating-linear-gradient(-45deg,#BDB9B0 0 1px,#E9E6DF 1px 4px)', border: '1px solid #BDB9B0' }
    };
    const items = D.clusters.map(c => {
      const z = D.Z[c.zone];
      const on = lit.includes(c.zone) && (!active || active === c.zone);
      const isSel = sel === c.id;
      const showCells = c.kind === 'stalls' && (mode === 'inventory' || iso || p.cells);
      const rows = c.cols ? Math.ceil(c.n / c.cols) : 1;
      const cells = showCells ? Array.from({ length: c.n }, (_, i) => {
        const id = `${c.zone}-${c.id}-${String(i + 1).padStart(3, '0')}`;
        const st = mode === 'inventory' ? this.status(c.id, i) : null;
        const isS = selStall === id;
        const base = mode === 'inventory' ? STAT[st] : { background: 'rgba(255,255,255,0.5)', border: `1px solid ${z.color}33` };
        return { id, style: { ...base, outline: isS ? '2px solid #F07C12' : 'none', outlineOffset: 1, cursor: mode === 'inventory' && st === 'available' ? 'pointer' : 'default', transform: isS && iso ? 'translateZ(10px)' : 'none' },
          onClick: e => { if (mode === 'inventory') { e.stopPropagation(); p.onStall && p.onStall({ id, status: st, cluster: c, index: i }); } } };
      }) : [];
      const ht = p.heat ? p.heat[c.id] : null;
      const tint = ht != null ? `rgba(158,27,34,${0.08 + ht * 0.55})` : on ? z.tint : '#F1EFEA';
      return {
        ...c, cells, showCells, heatLabel: ht != null ? Math.round(ht * 100) + '% busy' : null,
        showLabel: p.labels !== false && !(mode === 'inventory' && showCells),
        ink: on ? (c.zone === 'D' && (c.kind === 'hero') ? '#fff' : '#0E0E0F') : '#A29E95',
        gridStyle: { position: 'absolute', inset: '6%', display: 'grid', gridTemplateColumns: `repeat(${c.cols || 1},1fr)`, gridTemplateRows: `repeat(${rows},1fr)`, gap: '2px' },
        onClick: () => p.onCluster && p.onCluster(c),
        style: {
          position: 'absolute', left: c.x / 10 + '%', top: c.y / 5 + '%', width: c.w / 10 + '%', height: c.h / 5 + '%',
          background: ht != null ? tint : c.kind === 'hero' && on ? (c.zone === 'D' ? z.color : z.color + '22') : c.kind === 'stage' && on ? z.color + '1F' : tint,
          border: `1px solid ${on ? z.color : '#D6D2C8'}`, outline: isSel ? `3px solid ${z.color}` : 'none', outlineOffset: 2,
          cursor: p.onCluster ? 'pointer' : 'default', overflow: 'hidden',
          transition: 'background .6s, opacity .6s, transform .8s, box-shadow .8s',
          transform: iso ? `translateZ(${on ? (isSel ? 22 : 8) : 0}px)` : 'none',
          boxShadow: iso && on ? `3px 3px 0 ${z.color}66` : 'none',
          opacity: on ? 1 : 0.55
        }
      };
    });
    const zl = [{ id: 'A', l: 2, t: -6.8 }, { id: 'B', l: 54, t: -6.8 }, { id: 'D', l: 2, t: 101 }, { id: 'C', l: 72, t: 101 }];
    const zoneLabels = p.zoneLabels === false ? [] : zl.map(o => ({ ...D.Z[o.id], style: { position: 'absolute', left: o.l + '%', top: o.t + '%', opacity: lit.includes(o.id) ? 1 : 0.25, transition: 'opacity .6s' } }));
    const cargo = [12, 30, 66, 86].map(l => ({ style: { position: 'absolute', left: l + '%', top: '-2.2%', width: '5%', height: '2.2%', background: '#E3E0D8', fontFamily: 'var(--f-label)', fontSize: '0.55cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6A66', letterSpacing: '.1em' } }));
    let routeLayer = null;
    if (p.route) {
      const pts = p.routePts || '500,500 500,250 643,250 643,118 643,66';
      const h = React.createElement;
      routeLayer = h('svg', { key: 'r', viewBox: '0 0 1000 500', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', transform: iso ? 'translateZ(30px)' : 'none' } },
        h('polyline', { points: pts, fill: 'none', stroke: '#0E0E0F', strokeWidth: 5, strokeLinejoin: 'round', strokeDasharray: 900, strokeDashoffset: 900, style: { animation: 'iseDash 2.4s ease forwards' } }),
        h('circle', { cx: 500, cy: 494, r: 7, fill: '#F07C12', stroke: '#0E0E0F', strokeWidth: 2 }),
        h('circle', { cx: 643, cy: 66, r: 6, fill: '#F07C12', style: { animation: 'isePulse 1.6s ease-out infinite' } }),
        h('circle', { cx: 643, cy: 66, r: 7, fill: '#0E0E0F', stroke: '#fff', strokeWidth: 2 }));
    }
    const pins = (p.pins || []).map(pn => ({ ...pn, style: { position: 'absolute', left: pn.x / 10 + '%', top: pn.y / 5 + '%', transform: 'translate(-50%,-50%)' + (iso ? ' translateZ(26px)' : ''), width: '2.1cqw', height: '2.1cqw', borderRadius: '50%', background: pn.bg || '#0E0E0F', color: '#fff', fontSize: '1cqw', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)', fontFamily: 'var(--f-body)' } }));
    return { planStyle, roofStyle, items, zoneLabels, cargo, routeLayer, pins };
  }
}

function render(v) {
  return (
    <>
      <div style={{ position: "relative", width: "100%", containerType: "inline-size", fontFamily: "var(--f-body)", perspective: "2400px", padding: "3.5% 0 5%", boxSizing: "border-box" }}>
        <div style={sx(v.planStyle)}>
          <div style={{ position: "absolute", inset: "0", background: "#FBFAF7", border: "1.5px solid #0E0E0F" }} />
          <div style={{ position: "absolute", top: "0", bottom: "0", left: "48%", width: "4%", background: "#F07C12" }} />
          <div style={{ position: "absolute", left: "0", right: "0", top: "46%", height: "8%", background: "#F07C12", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "0.9cqw", letterSpacing: "0.4em", color: "#0E0E0F", fontWeight: "500" }}>
              SPORTS BOULEVARD →
            </span>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "0.9cqw", letterSpacing: "0.4em", color: "#0E0E0F", fontWeight: "500" }}>
              ← SPORTS BOULEVARD
            </span>
          </div>
          {list(v.zoneLabels).map((z, $index) => (
            <Fragment key={$index}>
              {" "}
              <div style={sx(z?.style)}>
                {" "}
                <span style={sx(`font-family:var(--f-display);font-stretch:62%;font-weight:800;font-size:calc(1.25cqw * 0.82);letter-spacing:0.02em;color:${z?.color ?? ""};text-transform:uppercase;`)}>
                  {"Zone "}{txt(z?.id)}{" · "}{txt(z?.name)}
                </span>
                {" "}
              </div>
              {" "}
            </Fragment>
          ))}
          {" "}
          {list(v.items).map((c, $index) => (
            <Fragment key={$index}>
              {" "}
              <div onClick={c?.onClick} title={c?.name} style={sx(c?.style)}>
                {" "}
                {c?.showCells ? (
                  <>
                    {" "}
                    <div style={sx(c?.gridStyle)}>
                      {" "}
                      {list(c?.cells).map((s, $index) => (
                        <Fragment key={$index}>
                          {" "}
                          <div onClick={s?.onClick} title={s?.id} style={sx(s?.style)} />
                          {" "}
                        </Fragment>
                      ))}
                      {" "}
                    </div>
                    {" "}
                  </>
                ) : null}
                {" "}
                {c?.showLabel ? (
                  <>
                    <div style={{ position: "relative", padding: "0.5cqw 0.6cqw", display: "flex", flexDirection: "column", gap: "0.15cqw", pointerEvents: "none" }}>
                      <span style={sx(`font-size:0.95cqw;font-weight:600;line-height:1.1;color:${c?.ink ?? ""};text-wrap:balance;`)}>{txt(c?.name)}</span>
                      <span style={sx(`font-family:var(--f-label);font-size:0.7cqw;color:${c?.ink ?? ""};opacity:0.75;`)}>{txt(c?.meta)}</span>
                      {c?.heatLabel ? (
                        <>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "0.8cqw", fontWeight: "500", color: "#fff", background: "#0E0E0F", alignSelf: "flex-start", padding: "0.1cqw 0.4cqw", marginTop: "0.2cqw" }}>
                            {txt(c?.heatLabel)}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : null}
                {" "}
              </div>
              {" "}
            </Fragment>
          ))}
          <div style={{ position: "absolute", left: "42%", width: "16%", bottom: "-4.5%", height: "4.5%", background: "#0E0E0F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-label)", fontSize: "0.7cqw", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
            MAIN ENTRANCE · REGISTRATION
          </div>
          {list(v.cargo).map((g, $index) => (
            <Fragment key={$index}>
              {" "}
              <div style={sx(g?.style)}>CARGO</div>
              {" "}
            </Fragment>
          ))}
          {" "}
          {list(v.pins).map((pn, $index) => (
            <Fragment key={$index}>
              {" "}
              <div title={pn?.label} style={sx(pn?.style)}>{txt(pn?.glyph)}</div>
              {" "}
            </Fragment>
          ))}
          {" "}{txt(v.routeLayer)}{" "}
          <div style={sx(v.roofStyle)}>
            <div style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(90deg,transparent 0 6.2%,rgba(255,255,255,0.08) 6.2% 6.5%),repeating-linear-gradient(0deg,transparent 0 12%,rgba(255,255,255,0.06) 12% 12.6%)" }} />
            <span style={{ position: "absolute", left: "3%", top: "6%", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "calc(4cqw * 0.82)", color: "#fff", letterSpacing: "0.01em" }}>
              Bharat Mandapam
            </span>
            {" "}
            <span style={{ position: "absolute", left: "3%", top: "20%", fontFamily: "var(--f-label)", fontSize: "0.9cqw", color: "#BDB9B0", letterSpacing: "0.2em" }}>
              BHARAT MANDAPAM · PRAGATI MAIDAN · ROOF
            </span>
            {" "}
          </div>
          {" "}
        </div>
      </div>
    </>
  );
}

export default defineDC("Hall Plan", Component, render);
