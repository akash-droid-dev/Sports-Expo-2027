# ARBrain — web app knowledge vault

This folder is an **Obsidian vault section** for ARBrain. It holds the complete memory of **India Sports Expo 2027**: every request and decision, the design system, the architecture, every page, every asset and screenshot, and the reusable patterns and playbooks for building the next web application.

## Put it into your ARBrain vault

**Option A: merge into your existing ARBrain vault (recommended)**
1. Download this branch (`arbrain/india-sports-expo-2027`) or the `ARBrain-India-Sports-Expo-2027.zip` package.
2. Copy everything **inside** this `ARBrain/` folder into the root of your ARBrain vault. The numbered folders (`10 Projects`, `20 Design Systems`, …) merge with yours. If you already have folders with these names, the files simply add up; nothing is overwritten unless you have notes with the same names.
3. Open Obsidian and start at [[00 Home]].

**Option B: open it on its own**
- Obsidian → *Open folder as vault* → choose this `ARBrain/` folder.

**Option C: keep it synced with git**
- In your vault: `git clone -b arbrain/india-sports-expo-2027 https://github.com/akash-droid-dev/Sports-Expo-2027.git` and point a folder/symlink at `ARBrain/`, or use the Obsidian Git plugin.

No Obsidian settings (`.obsidian/`) are included, so your themes, plugins and hotkeys stay untouched. The notes use standard Markdown, YAML front matter, `[[wikilinks]]`, embeds and one Canvas file. They work with core Obsidian; Dataview is optional (see [[Vault Conventions]]).

## What's inside

| Folder | Purpose |
|---|---|
| `00 Home.md` | Dashboard. Start here. |
| `10 Projects/` | One folder per web app. `India Sports Expo 2027/` is the full project memory. |
| `20 Design Systems/` | Design systems you can reuse or extend (colour, type, motion, components). |
| `30 Patterns/` | Proven building blocks (animations, scroll, mobile, compat) with the real source code. |
| `40 Playbooks/` | Step-by-step methods: from a Claude Design handoff to a live, fast site. Includes the test harness scripts. |
| `50 Templates/` | Obsidian templates for new projects, pages, decisions, patterns and requests. |
| `90 Assets/` | Every asset: logo, photos, videos, the original handoff zip, client uploads, screenshots. |
| `99 Meta/` | How this vault is organised. |

Source code lives in the same branch, one level up (the full Next.js app). Snapshot: commit `6aaefbc` on `main`, see [[ISE Source Snapshot]].
