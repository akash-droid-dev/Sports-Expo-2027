---
type: meta
tags:
  - meta
---

# Vault Conventions

How ARBrain is organised, so every future web app lands in the same structure.

## Folders (Johnny-Decimal style)
```
00 Home.md                     Dashboard
10 Projects/<Project>/         One folder per web app
    <Project>.md               Project hub (MOC): status, links, everything else links from here
    <PFX> Brief and Scope.md
    <PFX> Timeline and Decisions.md
    <PFX> Request Log.md       Client requests, verbatim
    <PFX> Architecture.md, Repo Map.md, Routes and Pages.md, Data Model.md
    <PFX> Build and Deploy.md, Device Support.md, Performance Log.md
    <PFX> Asset Inventory.md, Media and Credits.md, Screenshots.md
    <PFX> Launch Checklist and Known Gaps.md, Source Snapshot.md
    Pages/<Page> page.md       One note per page/route
    <Project> Map.canvas       Visual map of the project
20 Design Systems/<Name>/      Tokens, type, motion, components (reusable across projects)
30 Patterns/                   Project-independent building blocks, with source
40 Playbooks/                  Step-by-step methods; Harness/ holds test scripts
50 Templates/                  Obsidian templates (core Templates plugin: set folder to "50 Templates")
90 Assets/<Project>/           Binary assets for that project
99 Meta/                       This note
```

## Naming
- Project notes carry a short **prefix** so names stay unique across projects: India Sports Expo 2027 → `ISE`. (Obsidian links by note name.)
- Patterns and playbooks are **not** prefixed — they're meant to be shared.
- Page notes: `<Page> page` (e.g. [[Home page]]).

## Front matter
```yaml
type: project | brief | log | decision | reference | page | design-system | pattern | playbook | template | gallery | meta
project: "[[India Sports Expo 2027]]"   # on project-owned notes
status: live | proven | draft            # where useful
tags: [project/ise, …]
```

## Tags
- `project/<prefix>` — everything belonging to a project.
- `pattern/<area>` — animation, scroll, 3d, mobile, compat, brand, media, navigation, interaction, tooling, assistant, typography.
- `design-system`, `playbook`, `performance`, `build`, `data`, `assets`, `log/requests`.

## Optional Dataview queries
If you use the Dataview plugin:
````
```dataview
TABLE status, file.mtime AS updated FROM "30 Patterns" WHERE type = "pattern" SORT file.name
```
````
````
```dataview
LIST FROM #project/ise WHERE type = "page"
```
````

## Adding a new project
1. Duplicate [[Template - Web App Project]] into `10 Projects/<Name>/<Name>.md`, pick a prefix.
2. Log every client request verbatim in `<PFX> Request Log` ([[Template - Request]]), and every decision in the timeline ([[Template - Decision]]).
3. When something proves reusable, promote it to `30 Patterns/` with its source ([[Template - Pattern]]).
