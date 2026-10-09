'use client';
// Generated from design/site/Design System.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import BrandLogo from '@/components/BrandLogo';
import '@/data/ise';

class Component extends DCLogic {}

function render(v) {
  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <header style={{ position: "sticky", top: "0", zIndex: "60", background: "#0E0E0F", color: "#fff", display: "flex", alignItems: "center", gap: "28px", padding: "0 28px", height: "60px" }}>
          <a href={withBase("/")} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#fff" }}>
            <BrandLogo className="site-logo" />
          </a>
          <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.16em", color: "#BDB9B0" }}>DESIGN SYSTEM · V1.0</span>
        </header>
        <section data-screen-label="Overview" style={{ padding: "72px 28px 48px", maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "48px", alignItems: "end" }}>
          <h1 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(64px,9vw,148px) * 0.72)", lineHeight: "0.84" }}>
            Architecture
            <br />
            first.
          </h1>
          <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.5", maxWidth: "560px" }}>
            Black and white carry the architecture. Saffron, deep red and green are accents with fixed jobs. Square corners, hairline rules and condensed display type give every screen the same editorial frame, from the homepage to the admin console.
          </p>
        </section>
        <section data-screen-label="Screen directory" style={{ padding: "0 28px 72px", maxWidth: "1440px", margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 16px", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.9" }}>
            00 — Prototype map
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", borderTop: "2px solid #0E0E0F", borderLeft: "1px solid #E3E0D8" }}>
            <a href={withBase("/")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>01 · PUBLIC</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Home</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>Earth → Bharat Mandapam journey, 14 sections, live mode banner, search</span>
            </a>
            <a href={withBase("/explore")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>02 · EXPLORE</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Venue digital twin</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>Roof removal, zones, map modes, indoor routing, getting there</span>
            </a>
            <a href={withBase("/zones")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>03 · EXPLORE</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Zone experiences A–D</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>States map, theme pavilion, federations, marketplace, athlete body</span>
            </a>
            <a href={withBase("/exhibit")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>04 · EXHIBIT</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Exhibit</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>Product architecture, 3D booths, live inventory, directory, registration</span>
            </a>
            <a href={withBase("/attend")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>05 · ATTEND</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>{"Attend & My Expo"}</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>Visitor registration, accreditation, pass, dashboards, Plan My Day</span>
            </a>
            <a href={withBase("/connect")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>06 · CONNECT</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Business exchange</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>Matching, results, 10-step meeting flow, country pavilions</span>
            </a>
            <a href={withBase("/programme")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>07 · PROGRAMME</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>{"Programme & watch"}</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>5 agenda views, session pages, live mode, library, universal search</span>
            </a>
            <a href={withBase("/portal")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>08 · PORTAL</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Exhibitor control centre</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>13 modules, pre / live / post states, leads and legacy</span>
            </a>
            <a href={withBase("/mobile")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>09 · MOBILE</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Companion app</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>Pass, map and route, My Expo, check-in, push states</span>
            </a>
            <a href={withBase("/admin")} style={{ textDecoration: "none", padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B" }}>10 · ADMIN</span>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>{"Admin & command"}</b>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>Command dashboard, queues, venue, CMS editor, helpdesk board</span>
            </a>
          </div>
        </section>
        <section data-screen-label="Colour" style={{ background: "#F6F4EF", padding: "72px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "12px" }}>
              <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.9" }}>01 — Colour</h2>
              <span style={{ fontSize: "14px", color: "#3A3A3E" }}>70–80% neutral architecture · 20–30% accent</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "3fr 3fr 1.4fr 1fr 1fr", height: "200px", border: "1px solid #0E0E0F" }}>
              <div style={{ background: "#fff", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "flex-end", borderRight: "1px solid #E3E0D8" }}>
                <b>White</b>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#FFFFFF · canvas</span>
              </div>
              <div style={{ background: "#0E0E0F", color: "#fff", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <b>Ink</b>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#0E0E0F · type, nav, contrast</span>
              </div>
              <div style={{ background: "#F07C12", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <b>Saffron</b>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#F07C12 · action</span>
              </div>
              <div style={{ background: "#9E1B22", color: "#fff", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <b>Deep red</b>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#9E1B22</span>
              </div>
              <div style={{ background: "#0B6E4F", color: "#fff", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <b>Green</b>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#0B6E4F</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "48px", background: "#F6F4EF", border: "1px solid #E3E0D8" }} />
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#F6F4EF Stone · section</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "48px", background: "#E3E0D8" }} />
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#E3E0D8 Rule</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "48px", background: "#6B6A66" }} />
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#6B6A66 Muted text</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "48px", background: "#C2610B" }} />
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#C2610B Saffron ink (text on white)</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "48px", background: "#5B3A9E" }} />
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#5B3A9E Zone B purple</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "48px", background: "#1F4E9E" }} />
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>#1F4E9E Info / query only</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", borderTop: "2px solid #0E0E0F" }}>
              <div style={{ padding: "14px 14px 14px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "10px", background: "#9E1B22" }} />
                <b>{"Zone A · India Sports & Heritage"}</b>
                <span style={{ fontSize: "13px", color: "#6B6A66" }}>Red. Heritage and institutions.</span>
              </div>
              <div style={{ padding: "14px 14px 14px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "10px", background: "#5B3A9E" }} />
                <b>{"Zone B · Sports Goods & Infrastructure"}</b>
                <span style={{ fontSize: "13px", color: "#6B6A66" }}>Purple. Industrial and product-led.</span>
              </div>
              <div style={{ padding: "14px 14px 14px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "10px", background: "#0A62BF" }} />
                <b>{"Zone C · Sports Tech & Experience"}</b>
                <span style={{ fontSize: "13px", color: "#6B6A66" }}>Blue. Innovation and technology.</span>
              </div>
              <div style={{ padding: "14px 14px 14px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ height: "10px", background: "#00803F" }} />
                <b>{"Zone D · Sports Business & Investment"}</b>
                <span style={{ fontSize: "13px", color: "#6B6A66" }}>Green. Business and growth.</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0", height: "40px", background: "#F07C12" }}>
              <span style={{ padding: "0 16px", fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.3em" }}>
                SPORTS BOULEVARD → INDIA → MANUFACTURING → TECHNOLOGY → EXPERIENCE → BUSINESS → GLOBAL
              </span>
            </div>
            <span style={{ fontSize: "13px", color: "#3A3A3E" }}>
              The Sports Boulevard is the one saffron surface used at scale: the circulation ribbon on the hall plan, route lines, progress bars and the primary CTA.
            </span>
          </div>
        </section>
        <section data-screen-label="Typography" style={{ padding: "72px 28px", maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.9" }}>02 — Type</h2>
          <div style={{ display: "grid", gridTemplateColumns: "200px minmax(0,1fr)", borderTop: "1px solid #0E0E0F" }}>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>
              DISPLAY XL
              <br />
              Manrope 700 · 104/1.04 · −0.035em
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,8vw,148px) * 0.72)", lineHeight: "0.84" }}>
              Play India.
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>
              DISPLAY L
              <br />
              56 / 1.04
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              Build the business of sport
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>
              DISPLAY M
              <br />
              700 · 20–42
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "30px", lineHeight: "0.9" }}>
              Sports goods manufacturing
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>
              BODY
              <br />
              Inter · 15–19
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontSize: "18px", lineHeight: "1.5", maxWidth: "680px" }}>
              Three days of exhibition, business matchmaking and programme across four event zones at Bharat Mandapam.
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>
              UI LABEL
              <br />
              Inter 600 · 12–15 · pill buttons
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em" }}>
              Add to My Expo · Book meeting · Navigate
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>
              DATA / META
              <br />
              Inter 500 · 10–15 · spaced capitals
            </span>
            <span style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-label)", fontSize: "14px", letterSpacing: "0.1em" }}>
              B-SGM-017 · DAY 2 · 11:00 · TABLE 14
            </span>
          </div>
        </section>
        <section data-screen-label="Components" style={{ background: "#F6F4EF", padding: "72px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.9" }}>03 — Components</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "24px" }}>
              <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>BUTTONS · SQUARE · 46–56 PX TALL</span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button className="scp-602a3d97" style={{ height: "52px", padding: "0 24px", border: "0", background: "#F07C12", color: "#0E0E0F", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                    Primary
                  </button>
                  <button className="scp-cbb39843" style={{ height: "52px", padding: "0 24px", border: "0", background: "#0E0E0F", color: "#fff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                    Secondary
                  </button>
                  <button className="scp-12697256" style={{ height: "52px", padding: "0 24px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                    Outline
                  </button>
                  <button disabled={true} style={{ height: "52px", padding: "0 24px", border: "0", background: "#E3E0D8", color: "#8A877F", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em" }}>
                    Disabled
                  </button>
                </div>
                <span style={{ fontSize: "13px", color: "#6B6A66" }}>One saffron button per view. Text links use ink with a saffron hover.</span>
              </div>
              <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>FORM FIELDS</span>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>Company name</span>
                  <input defaultValue={"Apex Sports India Pvt. Ltd."} style={{ height: "46px", border: "1px solid #0E0E0F", padding: "0 12px", fontSize: "15px" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#9E1B22" }}>GSTIN · error</span>
                  <input defaultValue={"03AABCA1234"} style={{ height: "46px", border: "2px solid #9E1B22", padding: "0 12px", fontSize: "15px" }} />
                  <span style={{ fontSize: "12px", color: "#9E1B22" }}>✕ GSTIN must be 15 characters.</span>
                </label>
              </div>
              <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                  STATUS · ALWAYS ICON + WORD, NEVER COLOUR ALONE
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.1em" }}>
                  <span style={{ border: "1px solid #C2610B", color: "#C2610B", padding: "5px 8px" }}>◷ PENDING</span>
                  <span style={{ border: "1px solid #1F4E9E", color: "#1F4E9E", padding: "5px 8px" }}>? QUERY</span>
                  <span style={{ border: "1px solid #0B6E4F", color: "#0B6E4F", padding: "5px 8px" }}>✓ APPROVED</span>
                  <span style={{ border: "1px solid #9E1B22", color: "#9E1B22", padding: "5px 8px" }}>✕ REJECTED</span>
                  <span style={{ border: "1px solid #0E0E0F", padding: "5px 8px" }}>■ ALLOCATED</span>
                  <span style={{ background: "#9E1B22", color: "#fff", padding: "5px 8px" }}>● LIVE</span>
                </div>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>STALL INVENTORY</span>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "16px", height: "16px", background: "#fff", border: "1px solid #0B6E4F" }} />
                    Available
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "16px", height: "16px", background: "repeating-linear-gradient(45deg,#F07C12 0 2px,#FFF3E6 2px 5px)", border: "1px solid #C2610B" }} />
                    Reserved
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "16px", height: "16px", background: "#3A3A3E" }} />
                    Allocated
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "16px", height: "16px", background: "repeating-linear-gradient(-45deg,#BDB9B0 0 1px,#E9E6DF 1px 4px)", border: "1px solid #BDB9B0" }} />
                    Blocked
                  </span>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>SEGMENTED CONTROLS · FILTER CHIPS</span>
                <div style={{ display: "flex", border: "1px solid #0E0E0F", width: "fit-content" }}>
                  <span style={{ height: "42px", padding: "0 18px", display: "flex", alignItems: "center", background: "#0E0E0F", color: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em" }}>
                    DAY 1
                  </span>
                  <span style={{ height: "42px", padding: "0 18px", display: "flex", alignItems: "center", borderLeft: "1px solid #0E0E0F", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em" }}>
                    DAY 2
                  </span>
                  <span style={{ height: "42px", padding: "0 18px", display: "flex", alignItems: "center", borderLeft: "1px solid #0E0E0F", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em" }}>
                    DAY 3
                  </span>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ height: "36px", padding: "0 12px", display: "flex", alignItems: "center", border: "1px solid #0E0E0F", background: "#0E0E0F", color: "#fff", fontSize: "13px", fontWeight: "600" }}>
                    ✓ Football
                  </span>
                  <span style={{ height: "36px", padding: "0 12px", display: "flex", alignItems: "center", border: "1px solid #0E0E0F", fontSize: "13px", fontWeight: "600" }}>
                    Hockey
                  </span>
                  <span style={{ height: "36px", padding: "0 12px", display: "flex", alignItems: "center", border: "1px solid #0E0E0F", fontSize: "13px", fontWeight: "600" }}>
                    Cricket
                  </span>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "0" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66", paddingBottom: "10px" }}>
                  LIST ROW · REPLACES CARD GRIDS
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "10px minmax(0,1fr) auto", gap: "14px", alignItems: "center", padding: "14px 0", borderTop: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8" }}>
                  <span style={{ width: "10px", height: "10px", background: "#5B3A9E" }} />
                  <span>
                    <b style={{ display: "block", fontSize: "16px" }}>Apex Sports India</b>
                    <span style={{ fontSize: "13px", color: "#6B6A66" }}>Jalandhar, India · Football Equipment</span>
                  </span>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>B-SGM-017</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px 4px minmax(0,1fr)", gap: "16px", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #E3E0D8" }}>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "14px" }}>10:00–10:45</span>
                  <span style={{ alignSelf: "stretch", background: "#0B6E4F" }} />
                  <span>
                    <b style={{ display: "block", fontSize: "16px" }}>The Future of AI Coaching</b>
                    <span style={{ fontSize: "13px", color: "#6B6A66" }}>Innovation Arena · SportsTech</span>
                  </span>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>PATTERNS</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px", lineHeight: "1.45" }}>
                  <div style={{ borderTop: "2px solid #0E0E0F", paddingTop: "8px" }}>
                    <b>Drawer</b>
                    <br />
                    <span style={{ color: "#6B6A66" }}>Right-side detail for exhibitors, products, sessions, profiles. Scrim closes.</span>
                  </div>
                  <div style={{ borderTop: "2px solid #0E0E0F", paddingTop: "8px" }}>
                    <b>Wizard</b>
                    <br />
                    <span style={{ color: "#6B6A66" }}>Numbered left rail, saffron progress bar, status track after submit.</span>
                  </div>
                  <div style={{ borderTop: "2px solid #0E0E0F", paddingTop: "8px" }}>
                    <b>Toast</b>
                    <br />
                    <span style={{ color: "#6B6A66" }}>Bottom-centre ink bar with saffron dot. 2.5 s. role=status.</span>
                  </div>
                  <div style={{ borderTop: "2px solid #0E0E0F", paddingTop: "8px" }}>
                    <b>Empty state</b>
                    <br />
                    <span style={{ color: "#6B6A66" }}>Dashed rule box, condensed headline, one next action.</span>
                  </div>
                  <div style={{ borderTop: "2px solid #0E0E0F", paddingTop: "8px" }}>
                    <b>Loading</b>
                    <br />
                    <span style={{ color: "#6B6A66" }}>Stone skeleton bars with a mono line saying what is loading.</span>
                  </div>
                  <div style={{ borderTop: "2px solid #0E0E0F", paddingTop: "8px" }}>
                    <b>Sample label</b>
                    <br />
                    <span style={{ color: "#6B6A66" }}>Mono caps tag: SAMPLE · DEMO · PROVISIONAL · ILLUSTRATIVE.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Principles" style={{ padding: "72px 28px", maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.9" }}>
            04 — Motion, access, loading
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "32px" }}>
            <div style={{ borderTop: "2px solid #0E0E0F", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", lineHeight: "1.5" }}>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>Motion explains space</b>
              <span>
                Earth zoom, roof removal, zone illumination, route drawing, camera moves into a zone. Ease cubic-bezier(.2,.7,.2,1), 400–1000 ms. No decorative loops. Reduced motion swaps camera moves for cuts.
              </span>
            </div>
            <div style={{ borderTop: "2px solid #0E0E0F", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", lineHeight: "1.5" }}>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>Accessible by default</b>
              <span>
                4.5:1 text contrast. Status uses icon and word. Every map has a list alternative. Captions and transcripts on all video. 44 px touch targets. Keyboard: Tab order follows reading order, Esc closes drawers, ⌘K opens search.
              </span>
            </div>
            <div style={{ borderTop: "2px solid #0E0E0F", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", lineHeight: "1.5" }}>
              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>Progressive loading</b>
              <span>Page shell → Earth → Bharat Mandapam assets → venue model → zone detail → stall model on demand. Mobile gets the 2D plan first and 3D on request.</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default defineDC("Design System", Component, render);
