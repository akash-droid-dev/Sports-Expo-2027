---
type: design-system
project: "[[India Sports Expo 2027]]"
tags:
  - design-system
  - states
  - project/ise
---

# ISE Status and States

## Status — always icon + word, never colour alone
| Status | Mark |
|---|---|
| Pending | ◷ PENDING |
| Query | ? QUERY (info blue) |
| Approved | ✓ APPROVED (green) |
| Rejected | ✕ REJECTED (deep red) |
| Allocated | ■ ALLOCATED |
| Live | ● LIVE (deep red) |

## Stall inventory (Hall Plan)
| State | Look |
|---|---|
| Available | White with a green border |
| Reserved | Saffron hatch |
| Allocated | `#3A3A3E` |
| Blocked | Grey hatch |

## Event phases
PRE-EVENT / LIVE / POST-EVENT switches on Portal and Admin; before / during / after on Programme; `liveMode` on Home.

## Empty, loading, error
- **Empty:** 1 px dashed `#BDB9B0` box, a condensed headline, one next action.
- **Loading:** stone `#F1EFEA` skeleton bars with a mono line saying what is loading.
- **Boot failure:** on-screen report after 9 s (errors, browser, build label).
