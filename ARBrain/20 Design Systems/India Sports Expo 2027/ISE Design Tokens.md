---
type: design-system
project: "[[India Sports Expo 2027]]"
tags:
  - design-system
  - tokens
  - project/ise
---

# ISE Design Tokens

Copy-paste starting point for a new app using this system.

## CSS
```css
:root {
  /* Neutrals */
  --ink: #0e0e0f;
  --white: #ffffff;
  --stone: #f6f4ef;
  --stone-2: #f1efea;
  --stone-3: #fbfaf7;
  --rule: #e3e0d8;
  --muted-1: #6b6a66;
  --muted-2: #8a877f;
  --muted-3: #bdb9b0;
  --graphite-1: #3a3a3e;
  --graphite-2: #2a2a2d;
  --graphite-3: #1a1a1c;
  /* Accent */
  --saffron: #f07c12;
  --saffron-ink: #c2610b;
  --saffron-tint: #fff3e6;
  --gold: #c9a227;
  --info: #1f4e9e;
  /* Zones */
  --zone-a: #9e1b22; --zone-a-tint: #f6e7e6;
  --zone-b: #3f4a56; --zone-b-tint: #e8ebee;
  --zone-c: #0b6e4f; --zone-c-tint: #e3f1eb;
  --zone-d: #141416; --zone-d-tint: #ecebe8;
  /* Logo (sporty layer) */
  --ise-navy: #2e3f8f;
  --ise-blue: #0a62bf;
  --ise-orange: #f07c12;
  --ise-green: #00803f;
  /* Type */
  --font-display: 'Archivo', sans-serif;      /* font-stretch: 62%; font-weight: 900; font-style: italic */
  --font-body: 'Instrument Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  /* Motion */
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-io: cubic-bezier(0.76, 0, 0.24, 1);
  /* Layout */
  --max: 1440px;
  --gutter: 28px;
  --header-h: 60px;
}
```

## JSON
```json
{
  "color": {
    "ink": "#0E0E0F", "white": "#FFFFFF", "stone": "#F6F4EF", "stone2": "#F1EFEA", "stone3": "#FBFAF7",
    "rule": "#E3E0D8", "muted": ["#6B6A66", "#8A877F", "#BDB9B0"], "graphite": ["#3A3A3E", "#2A2A2D", "#1A1A1C"],
    "saffron": "#F07C12", "saffronInk": "#C2610B", "saffronTint": "#FFF3E6", "gold": "#C9A227", "info": "#1F4E9E",
    "zone": { "A": ["#9E1B22", "#F6E7E6"], "B": ["#3F4A56", "#E8EBEE"], "C": ["#0B6E4F", "#E3F1EB"], "D": ["#141416", "#ECEBE8"] },
    "logo": { "navy": "#2E3F8F", "blue": "#0A62BF", "orange": "#F07C12", "green": "#00803F" }
  },
  "font": {
    "display": { "family": "Archivo", "stretch": "62%", "weight": 900, "style": "italic", "sizes": { "xl": "clamp(64px,10vw,148px)", "l": "80px", "m": "26-56px" }, "lineHeight": 0.86 },
    "body": { "family": "Instrument Sans", "weights": [400, 700], "size": "15-19px", "lineHeight": 1.5 },
    "mono": { "family": "JetBrains Mono", "weights": [400, 500], "size": "10-15px", "tracking": "0.1-0.22em" }
  },
  "space": [8, 12, 16, 24, 32, 48, 56],
  "radius": { "default": 0, "card": 10, "phoneFrame": [54, 42] },
  "motion": { "ease": "cubic-bezier(0.2,0.7,0.2,1)", "easeInOut": "cubic-bezier(0.76,0,0.24,1)", "duration": [400, 1000], "dealStagger": 110 },
  "layout": { "max": 1440, "gutter": 28, "header": 60, "breakpoints": { "fit": 1024, "phone": 900, "small": 600 } }
}
```
