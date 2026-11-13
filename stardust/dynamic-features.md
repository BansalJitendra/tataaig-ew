# Dynamic features — www.tataaig.com (home page only)

Source: `stardust/current/_dynamics.json` → `stardust/dynamics/dynamic-features.generated-plan.{md,json}` (58 raw rows, curated below into 12). Hands-off: owner decisions are recorded by name and the interim tier ships; nothing is `decided-out`.

## Listings contract
none — the home page's card groups (Why TATA AIG, Our Products, Related Articles) are authored, fixed compositions on the source; no index-backed listing on this page.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | quote-widget | Car / Bike / Health / Travel / Home quote tabs (forms `motor4w_main`, `motor2w_main`: registration-number field + Buy now; JS-wired, no action) | F | home | rebuild-native | block | needs-backend | pending | tabs + form, submit hands off | D1: quote backend — interim: submit navigates to the source quote journey on www.tataaig.com | rows 43, 44 |
| 2 | captcha | form protection: captcha / antibot (www.google.com/recaptcha) | F | home | embed-passthrough | embed | needs-backend | pending | goes with the quote backend | D1 | row 42 |
| 3 | rto-lookups | `/lambda/prod-master/getrtolocation/{2w,4w}`, `/getCountry`, `/api/restricted-countries` (quote-form lookups) | A | home | data-fed | widget | needs-business-decision | pending | host-bound on EDS | D1 — not needed by the interim hand-off | rows 5–8 |
| 4 | save-quote | POST `/lambda/prod-searchAndQuotation/saveData` | S | home | data-fed | widget | needs-business-decision | pending | host-bound on EDS | D1 | row 48 |
| 5 | next-data-prefetch | `/_next/data/<build>/*.json` route prefetches (Next.js link prefetch, 30 rows) | A | home | static-snapshot | content | self | pending | framework noise: EDS pages are full documents | none — reason: prefetch of linked pages, no consumer after migration | rows 4, 9–37 |
| 6 | page-globals | `digitalData`, `dataLayer`, `__NEXT_DATA__` objects | A | home | static-snapshot | content | self | pending | `digitalData`/`dataLayer` kept by martech runtime when enabled | martech (owner) | rows 38–40 |
| 7 | next-hydration | Next.js client framework | CR | home | static-snapshot | content | self | pending | settled DOM ships as authored content | none | row 41 |
| 8 | card-groups | 3 card groups detected as listing candidates (Why TATA AIG 6, Our Products 6+7) | L | home | static-snapshot | content | self | pending | authored blocks, not index-backed | none — authored on source | rows 45–47 |
| 9 | tags | Adobe DTM satelliteLib + AppMeasurement, GTM-TD2BW4B (GA/Ads, retargeting pixel), Dynatrace RUM | T | home | embed-passthrough | embed | needs-business-decision | pending | martech contract, every part disabled | D2: tags on the new host (owner enables) | rows 49–52, 54–56 |
| 10 | moengage | MoEngage web SDK (`/js/moengage_prod.js` → cdn.moengage.com, sdk-03.moengage.com) | T | home | embed-passthrough | embed | needs-business-decision | pending | martech contract route `moengage`, disabled | D2 | rows 3, 53 |
| 11 | vwo-openai | dev.visualwebsiteoptimizer.com (VWO), bzr(cdn).openai.com — loaded by the tag stack | T | home | embed-passthrough | embed | needs-human-capture | pending | arrive through the tag managers when enabled | D2 | rows 0–2 |
| 12 | runtime-iframe | iframe without src (runtime-injected by a tag) | V | home | embed-passthrough | embed | needs-human-capture | pending | arrives with the tags | D2 | row 57 |

## Decision batch
- **D1 — quote backend.** The quote widget's lookups and save endpoints live on www.tataaig.com (host-bound). Interim (shipped): the widget UI is rebuilt; "Buy now" / "Get Quote" hand the visitor to the source's own quote journey. Owner decides whether to keep that hand-off or proxy the APIs.
- **D2 — tags on the new host.** Everything is carried over in `stardust/martech-contract.json` with every part disabled (`martech-handoff.md`). No CMP was found on the source; the owner picks the consent model and enables routes.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | — | — |
