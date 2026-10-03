---
type: reference
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - data
---

# ISE Data Model

All demo data lives in `src/data/ise.js` and is exposed as `window.ISE` (copied from the design handoff's `ise-data.js`). Every name, figure, date and stall ID is **sample data** — replace with backend data before launch ([[ISE Launch Checklist and Known Gaps]]).

Top-level keys: `Z`, `zones`, `clusters`, `exhibitors`, `products`, `stages`, `speakers`, `sessions`, `states`, `countries`, `startups`, `matches`, `sp`, `cl`

## Hall 2 at a glance
- Exhibition Hall 2, Yashobhoomi (IICC), Dwarka Sector 25, New Delhi.
- Schematic plan is 1000 × 500 units (derived from `Hall2_Layout_with_Legend.pdf`, not to scale). Zones A and D on the left half, B and C on the right; the saffron **Sports Boulevard** runs between them.
- Stall IDs follow `<zone>-<cluster>-<number>`, e.g. `B-SGM-017`.

## Zones
| id | name | short | color | tint | blurb |
|---|---|---|---|---|---|
| A | India Sports & Heritage | India | #9E1B22 | #F6E7E6 | States, Ministry, federations and the story of Indian sport. |
| B | Sports Goods & Infrastructure | Manufacturing | #3F4A56 | #E8EBEE | Manufacturers, venue builders, surfaces, apparel and supply chain. |
| C | Sports Tech & Experience | Technology | #0B6E4F | #E3F1EB | SportsTech, startups, sports science and live experiences. |
| D | Sports Business & Investment | Business | #141416 | #ECEBE8 | Country pavilions, buyers, investors, deal rooms and lounges. |

## Clusters (areas of the hall)
| id | zone | name | meta | kind | n |
|---|---|---|---|---|---|
| STA | A | States & UTs Sports Destinations | 4 pavilions | pav | 4 |
| THM | A | Theme Pavilion | Hero pavilion | hero | 1 |
| MYS | A | Ministry of Youth Affairs & Sports | 2 pavilions | pav | 2 |
| FED | A | Federations & Institutions | 2 pavilions | pav | 2 |
| HER | A | India Sports Heritage & Interactive | 2 pavilions | pav | 2 |
| SGM | B | Sports Goods Manufacturing | 31 stalls · 2 pavilions | stalls | 31 |
| SIV | B | Sports Infrastructure & Venue Build | 32 stalls · 1 pavilion | stalls | 32 |
| OEM | B | OEM / ODM & Supply Chain | 20 stalls | stalls | 20 |
| APF | B | Apparel & Footwear | 14 stalls · 1 pavilion | stalls | 14 |
| SRF | B | Surfaces & Turf | 9 stalls · 1 pavilion | stalls | 9 |
| LSE | B | Lighting, Seating & Engineering | 13 stalls | stalls | 13 |
| CTY | D | International / Country Pavilions | 6 pavilions | pav | 6 |
| ISX | D | India Sports Business Exchange | Matchmaking floor | hero | 1 |
| B2B | D | B2B Meeting Zone & Networking Café | 40 tables | room | 1 |
| HBL | D | Hosted Buyer Lounge | Invite only | room | 1 |
| MOU | D | MoU / Deal Rooms | 6 rooms | room | 1 |
| INV | D | Investor Lounge | Accredited | room | 1 |
| FDL | D | Federation Lounge | Accredited | room | 1 |
| CEO | D | CEO Lounge | Invite only | room | 1 |
| STI | C | SportsTech & Innovation | 34 stalls · 1 pavilion | stalls | 34 |
| IAS | C | Innovation Arena Stage | 324 seats | stage | 1 |
| SUV | C | Startup Village | 30 stalls · 1 pavilion | stalls | 30 |
| PSS | C | Performance & Sports Science | 30 stalls · 1 pavilion | stalls | 30 |
| IEX | C | Interactive Experiences | Demo floor | room | 1 |
| TSA | C | Try Sport Arena | Live experience | room | 1 |

## Exhibitors (sample)
| id | name | city | sector | stall | type | products | seeking | booth |
|---|---|---|---|---|---|---|---|---|
| apex | Apex Sports India | Jalandhar, India | Football Equipment | B-SGM-017 | Manufacturer · Exporter | Match Footballs, Training Balls, Goal Systems, Training Accessories | European Distributors | Premium Booth |
| willow | Meerut Willow Works | Meerut, India | Cricket Equipment | B-SGM-009 | Manufacturer | English Willow Bats, Protective Pads, Leather Balls | UK & Australia retail | Standard Booth |
| arena | ArenaBuild Infrastructure | Pune, India | Stadium Construction | B-SIV-004 | EPC Contractor | Modular Stands, Roof Systems, Venue Fit-out | State sports authorities | Raw Space |
| turf | TurfLine Systems | Rotterdam, Netherlands | Surfaces & Turf | B-SRF-003 | Manufacturer | FIFA Quality Turf, Hockey Water-based Turf, Shock Pads | Indian installation partners | Premium Booth |
| lumen | Luminar Stadium Lighting | Stuttgart, Germany | Lighting | B-LSE-005 | Manufacturer | Broadcast LED Floodlights, Light Show Control | Venue developers | Premium Booth |
| stride | Stridewell Footwear | Agra, India | Performance Footwear | B-APF-008 | OEM · Brand | Spike Plates, Running Midsoles, Court Shoes | Global brand OEM contracts | Standard Booth |
| origin | Origin Supply Co. | Tiruppur, India | Teamwear OEM | B-OEM-014 | OEM / ODM | Sublimated Teamwear, Recycled Polyester Kits | Club & league licensees | Standard Booth |
| motion | MotionIQ SportsTech | Bengaluru, India | AI Coaching | C-STI-011 | SportsTech | Computer-vision Coaching, Skill Benchmarks | Federations, academies | Premium Booth |
| matrix | SportMatrix Analytics | Gurugram, India | Performance Analytics | C-STI-022 | SportsTech | Match Data Platform, Scouting Index | Leagues, broadcasters | Standard Booth |
| velocity | Velocity Performance Labs | Hyderabad, India | Sports Science | C-PSS-006 | Lab · Services | Force Plates, Recovery Protocols, VO2 Testing | High-performance centres | Premium Booth |
| hayate | Hayate Sports Engineering | Osaka, Japan | Timing Systems | D-CTY-JP1 | Manufacturer | Photo-finish Timing, Start Systems | Athletics federations | Country Pavilion |
| flex | FlexSeat Arenas | Melbourne, Australia | Seating | B-LSE-011 | Manufacturer | Retractable Seating, Tip-up Stadium Seats | Indian venue projects | Standard Booth |

## Products (sample)
| name | by | stall | cat | type | moq | tag |
|---|---|---|---|---|---|---|
| Pro Match Football FQ-5 | Apex Sports India | B-SGM-017 | Football | Equipment | MOQ 1,000 | FIFA Quality (sample claim) |
| Portable Aluminium Goal 7.32 m | Apex Sports India | B-SGM-017 | Football | Equipment | MOQ 20 | Export ready |
| Grade 1 English Willow Bat | Meerut Willow Works | B-SGM-009 | Cricket | Equipment | MOQ 200 | Hand-made |
| AquaPlay Hockey Turf | TurfLine Systems | B-SRF-003 | Hockey | Surface | Per pitch | Water-based |
| LX-2000 Broadcast Floodlight | Luminar Stadium Lighting | B-LSE-005 | Outdoor | Infrastructure | Project | 4K broadcast |
| Carbon Sprint Spike Plate | Stridewell Footwear | B-APF-008 | Athletics | Footwear | MOQ 5,000 | OEM |
| CoachVision AI | MotionIQ SportsTech | C-STI-011 | Cricket | Software | SaaS | Live demo |
| ForceTrack Dual Plates | Velocity Performance Labs | C-PSS-006 | Fitness | Sports Science | Unit | Live demo |

## Stages
- Innovation Arena
- Business Exchange Stage
- Plenary Hall

## Speakers (sample)
| id | name | role | org |
|---|---|---|---|
| s1 | Dr. Meera Raghavan | Director, High Performance (sample) | National Sports Science Centre (demo) |
| s2 | Lukas Brandt | Chief Sourcing Officer | Global Sports Retail GmbH (demo) |
| s3 | Arjun Mehta | Founder & CEO | MotionIQ SportsTech (demo) |
| s4 | Aiko Tanaka | Head of Venue Technology | Hayate Sports Engineering (demo) |
| s5 | Priya Nair | Partner | Kinetic Ventures (demo) |
| s6 | Rahul Bhandari | Managing Director | Apex Sports India (demo) |
| s7 | Sarah Okafor | Commercial Director | Stadia Partners UK (demo) |
| s8 | Kabir Sethi | Secretary General | Sample National Federation |

## Sessions (sample)
| id | day | time | end | title | stage | topic | speakers | cap | zone | status | dur |
|---|---|---|---|---|---|---|---|---|---|---|---|
| x1 | 1 | 10:00 | 11:00 | The Global Sports Economy Meets India | Plenary Hall | Investment | s5, s7 | 1200 | D | ondemand | 58 min |
| x2 | 1 | 11:30 | 12:15 | Made in India: Scaling Sports Goods Exports | Business Exchange Stage | Manufacturing | s6, s2 | 220 | B | ondemand | 44 min |
| x3 | 1 | 14:00 | 14:45 | Stadiums as Year-round Assets | Innovation Arena | Infrastructure | s7, s4 | 324 | B | ondemand | 41 min |
| x4 | 1 | 16:00 | 17:00 | Startup Pitch Round 1: Athlete Tech | Innovation Arena | Startups | s5 | 324 | C | ondemand | 62 min |
| x5 | 2 | 10:00 | 10:45 | The Future of AI Coaching | Innovation Arena | SportsTech | s3, s1 | 324 | C | live | 45 min |
| x6 | 2 | 11:00 | 11:45 | Sports Science for the Next Olympic Cycle | Innovation Arena | Sports Science | s1 | 324 | C | upcoming | 45 min |
| x7 | 2 | 12:00 | 12:45 | Buyer Briefing: European Football Retail | Business Exchange Stage | Manufacturing | s2 | 220 | D | upcoming | 45 min |
| x8 | 2 | 14:00 | 15:00 | AI in Sport: Broadcast, Fans and Data | Plenary Hall | SportsTech | s3, s4 | 1200 | C | upcoming | 60 min |
| x9 | 2 | 15:30 | 16:15 | Investing in Indian Sports Startups | Business Exchange Stage | Investment | s5, s3 | 220 | D | upcoming | 45 min |
| x10 | 3 | 10:00 | 10:45 | Federations & the Grassroots Pipeline | Plenary Hall | Federations | s8 | 1200 | A | upcoming | 45 min |
| x11 | 3 | 11:30 | 12:30 | Startup Pitch Final | Innovation Arena | Startups | s5, s3 | 324 | C | upcoming | 60 min |
| x12 | 3 | 14:00 | 14:45 | Surfaces, Turf and Climate-ready Venues | Innovation Arena | Infrastructure | s7 | 324 | B | upcoming | 45 min |

## States (sample)
| id | name | identity | sports | venues | pav | x | y |
|---|---|---|---|---|---|---|---|
| GJ | Gujarat | Host-city ambitions and integrated sports enclaves | Athletics, Football, Aquatics | Sardar Vallabhbhai Patel Sports Enclave (sample) | A-STA-P1 | 22 | 50 |
| OD | Odisha | Hockey capital and high-performance centres | Hockey, Athletics, Football | Kalinga Stadium (sample) | A-STA-P2 | 64 | 54 |
| HR | Haryana | Wrestling, boxing and Olympic medal heartland | Wrestling, Boxing, Javelin | Tau Devi Lal Stadium (sample) | A-STA-P3 | 36 | 25 |
| MH | Maharashtra | Commercial sport, leagues and manufacturing | Cricket, Kabaddi, Shooting | Balewadi Sports Complex (sample) | A-STA-P4 | 32 | 60 |
| TN | Tamil Nadu | Chess, motorsport and coastal sport | Chess, Motorsport, Squash | Jawaharlal Nehru Stadium, Chennai (sample) | A-STA-P4 | 45 | 86 |
| KA | Karnataka | SportsTech and athlete science ecosystem | Badminton, Athletics, Swimming | Sree Kanteerava Stadium (sample) | A-STA-P3 | 36 | 77 |

## Countries (sample)
| id | name | pav | profile | companies | lon | lat |
|---|---|---|---|---|---|---|
| JP | Japan | D-CTY-P1 | Precision timing, materials and venue engineering | 9 | 138 | 36 |
| DE | Germany | D-CTY-P2 | Retail, lighting, engineering and football industry | 12 | 10 | 51 |
| GB | United Kingdom | D-CTY-P3 | Venue operations, leagues and sports media | 10 | -2 | 54 |
| AE | UAE | D-CTY-P4 | Event hosting, investment and sports tourism | 7 | 54 | 24 |
| AU | Australia | D-CTY-P5 | Sports science, seating and stadium delivery | 8 | 134 | -25 |
| US | United States | D-CTY-P6 | SportsTech, fan engagement and media rights | 11 | -98 | 39 |

## Startups (sample)
| name | country | tech | sport | problem | stage | seeking | stall | pitch |
|---|---|---|---|---|---|---|---|---|
| KheloLens | India | Computer vision | Kabaddi | Manual raid analysis takes coaches hours per match | Seed | Investor, Partner | C-SUV-004 | Day 1 · 16:20 |
| RecovR | India | Wearable + app | Athletics | Athletes lack objective recovery readiness data | Pre-Series A | Buyer, Investor | C-SUV-011 | Day 1 · 16:35 |
| Turfsense | Netherlands | IoT sensors | Football | Pitch wear is detected too late to prevent damage | Series A | Buyer, Partner | C-SUV-017 | Day 3 · 11:40 |
| FanLoop | UAE | Gamification | Cricket | Regional leagues struggle to retain digital fans | Seed | Partner | C-SUV-020 | Day 3 · 11:55 |
| GripAI | India | Edge AI | Archery | Form faults are invisible without expensive labs | Pre-seed | Investor | C-SUV-023 | Day 1 · 16:50 |
| Paceline | Australia | Data platform | Multi-sport | Academies cannot compare talent across regions | Seed | Buyer, Investor | C-SUV-028 | Day 3 · 12:10 |

## Matches (sample)
| name | country | role | seeking | score | why |
|---|---|---|---|---|---|
| Global Sports Retail GmbH | Germany | Buyer | Football Equipment | 94 | Product fit, Market fit, Buyer requirement, Geographic interest |
| Northline Distribution Ltd | United Kingdom | Distributor | Training Equipment | 88 | Product fit, Buyer requirement, Geographic interest |
| Gulf Arena Supplies | UAE | Buyer | Goal Systems & Nets | 81 | Product fit, Market fit |
| Kinetic Ventures | India | Investor | Manufacturing scale-up | 72 | Market fit, Geographic interest |

## Related
[[ISE Architecture]] · [[India Sports Expo 2027]] · [[ISE Routes and Pages]]
