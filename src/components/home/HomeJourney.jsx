'use client';
// The Home "Earth journey": a scroll-driven globe zoom from Earth to Yashobhoomi, then the
// venue finale. Split out of Home.jsx so scrolling re-renders only this section.
// `store` holds the scroll progress; `vals(p)` (Home's logic) turns it into what to show.
import { Fragment, useSyncExternalStore } from 'react';
import { txt, sx, list } from '@/dc/runtime';
import VenueStage from './VenueStage';

export default function HomeJourney({ store, vals }) {
  useSyncExternalStore(store.subscribe, store.get, store.get);
  const v = vals(store.p);
  return (
    <section data-screen-label="02 Earth journey" ref={v.journeyRef} style={sx(`position:relative;height:${v.journeyHeight ?? ""};background:#000;`)}>
      <div style={{ position: "sticky", top: "60px", height: "calc(100vh - 60px)", overflow: "hidden", background: "#000" }}>
        <div ref={v.mapRef} style={sx(`position:absolute;inset:0;opacity:${v.mapOpacity ?? ""};transition:opacity .3s;`)} />
        <div style={{ position: "absolute", inset: "0", pointerEvents: "none", background: "radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,0.55) 100%)" }} />
        <div style={sx(`position:absolute;inset:0;background:#000;opacity:${v.arrivalScrim ?? ""};pointer-events:none;`)} />
        {v.showPin ? (
          <>
            <div style={sx(`position:absolute;left:50%;top:50%;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;pointer-events:none;opacity:${v.pinOpacity ?? ""};`)}>
              <span style={{ background: "#F07C12", color: "#0E0E0F", fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", letterSpacing: "0.14em", padding: "6px 10px", fontWeight: "500", whiteSpace: "nowrap" }}>
                YASHOBHOOMI · IICC
              </span>
              <span style={{ width: "2px", height: "40px", background: "#F07C12" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F07C12", boxShadow: "0 0 0 6px rgba(240,124,18,0.3)" }} />
            </div>
          </>
        ) : null}
        <VenueStage p={v.journeyP} reduced={v.journeyReduced} />
        <nav aria-label="Journey" style={{ position: "absolute", left: "28px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "12px" }}>
          {list(v.crumbs).map((c, $index) => (
            <Fragment key={$index}>
              <button onClick={c?.go} style={sx(`background:none;border:0;padding:0;cursor:pointer;display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;color:${c?.color ?? ""};text-align:left;`)}>
                <span style={sx(`width:${c?.bar ?? ""};height:2px;background:${c?.color ?? ""};transition:width .4s;`)} />
                {txt(c?.label)}
              </button>
            </Fragment>
          ))}
        </nav>
        <div style={sx(`position:absolute;left:28px;bottom:32px;max-width:640px;color:${v.captionColor ?? ""};pointer-events:none;opacity:${v.captionOpacity ?? ""};`)}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", letterSpacing: "0.2em", opacity: "0.8", marginBottom: "10px" }}>
            {txt(v.stageKicker)}
          </div>
          <div style={{ fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "900", fontSize: "clamp(38px,8vw,128px)", lineHeight: "0.84" }}>
            {txt(v.stageTitle)}
          </div>
          <div style={{ fontSize: "17px", lineHeight: "1.45", marginTop: "14px", maxWidth: "520px", opacity: "0.9" }}>{txt(v.stageText)}</div>
        </div>
        <div style={sx(`position:absolute;right:28px;bottom:32px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.12em;color:${v.captionColor ?? ""};opacity:${(v.readoutOpacity ?? 1) * 0.7};text-align:right;line-height:1.7;pointer-events:none;`)}>
          <div>{txt(v.coordText)}</div>
          <div>{"ALT "}{txt(v.altText)}</div>
          <div>IMAGERY: ESRI WORLD IMAGERY</div>
        </div>
        <button onClick={v.skip} style={{ position: "absolute", right: "28px", top: "24px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "1px solid #55555A", height: "36px", padding: "0 14px", font: "600 12px 'Instrument Sans'", letterSpacing: "0.1em", cursor: "pointer" }}>
          SKIP INTRO →
        </button>
      </div>
    </section>
  );
}
