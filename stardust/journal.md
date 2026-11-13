# Journal — tataaig.com replica (single page)

## Extract — home page captured live, bounded single-page entry (2026-11-12)

- `crawl.mjs --url https://www.tataaig.com/ --pages / --dynamics`: 1/1 captured, real Chrome headless, HTTP 200, no bot wall, no consent wall.
- Per-page evidence: `/` live=yes, waitMode medium, status 200, 18 same-site data endpoints, hydrated (Next.js).
- Vision check: ok (thumbnail read whole page; lazy card imagery in Related Articles / app band blank in capture).
- Style census at 1440 + 360 → `_computed-styles.json`: single family Poppins (only the 400 face is declared; 500/600 are browser-synthesised), primary #264a9f, page bg #eff0f3, neumorphic shadow pair, radius mode 8px.
- cap-probe → `current/DESIGN.json` extensions.breakpoints: content max 1648px, shell fluid.
- Source CSS (11 sheets + inline styles) saved under `current/css/`; Poppins 400 woff2 (OFL) saved under `current/assets/fonts/`; favicon fetched by curl (crawler probe missed it).
- Bounded entry: no PRODUCT/DESIGN synthesis here — replica Phase 2 takes the bounded promotion branch.

## Preserve direction — bounded-single spec, empty register, dynamics triaged (2026-11-12)

- Bounded promotion branch (§ 1a): PRODUCT.md, DESIGN.md, DESIGN.json synthesized from `current/pages/index.json` + `stardust/replica/tokens.json` (census + source CSS lift), provenance `bounded-single`.
- `stardust/direction.md` written (preserve mode, hands-off, publish decision, martech decision). Register empty — pure replica.
- Dynamics: detect → 58 findings; plan with `--target-origin` (19/19 first-party API paths host-bound) and `--martech`; curated to 12 rows in `dynamic-features.md` (every row has a disposition) + `dynamic-features-plan.md`. Decision batch: D1 quote backend (interim: hand off to source quote journey), D2 tags on new host.
- Martech: spec-martech found GTM-TD2BW4B and a legacy DTM satelliteLib (not a Launch library), no CMP. Contract carries GTM, DTM, MoEngage routes, all `enabled: false`.

## Recreate + source-fidelity gate — home archetype passes at 1440 and 360 (2026-11-12)

- `stardust/prototypes/index-proposed.html` + `css/canon.css` + `css/index.css`, assets rehosted under `prototypes/assets/` (no source-host url()s). Content verbatim from the capture.
- 1440: pixel 2.15 %, Δh +1 px, content-diff 0 🔴 / 0 nothing-lost 🟡, clipped 0, overflow ok — 3 iterations + `--full` confirmation. visual-diff 3 STRETCHED IMAGE flags justified (source draws article images 100 %×250 px without object-fit).
- 360: pixel 3.70 %, Δh −1 px, content-diff 0 🔴 / 0 🟡, clipped 0 — 3 iterations + confirmation; residual band y5500–6000 (live serves low-quality resized article images).
- chrome-parity ✗ lines (11 @1440, 1 @360) judged measurement artefacts: nav x within 1 px by measure.mjs, header crop 98.6 % match, icon filename encoding of lazy icons, empty `<footer>` Δy. Recorded as residuals.
- cap-probe PASS (2560). gate-all prototype table: 1440 PASS 2.16 %, 360 PASS 3.7 %.
- Motion: quote tabs, testimonial arrow slide, mega menus + accessibility panel, app slide-up, shine sweep implemented; captureState restoreAtDelivery: strip marquee 30 s, shine, slide-up.
- Approved hands-off.

## Migrate plan + render — index rendered from the approved archetype (2026-11-12)

- plan: one page, approved-page branch (A), no siblings, no clusters.
- render: `migrate.mjs render index --canon-css stardust/prototypes/css/canon.css` → `stardust/migrated/index.html` (9 sections, 124 assets). 258 of 260 links point at source pages outside this run's scope — they stay on www.tataaig.com (scope extension, repointed to source).

## A-inventory — one page, one template (2026-11-12)

- `inventory.mjs`: 1 of 1 pages in scope (the whole run scope), template `index`. `rollout.json` site.da = aemcoder/0484faa8@main, liveHost main--0484faa8--aemcoder.aem.live. Modules filled on the sidecar (8 blocks).

## B-block — 8 distinct blocks, each converted once (2026-11-12)

- `blocks.mjs` + `plan.mjs`: quote-hero, why-tata, testimonials, products, about, whats-new, get-app, related-articles; header/footer are the chrome documents.

## B2-dynamic — dynamic surface confirmed (2026-11-12)

- `stardust/dynamic-features.md` was built from this run's own detection (same day, `--target-origin` probed): 12 curated rows, every row dispositioned; no change since.

## C-deliver — home page delivered and gated on the published origin (2026-11-12)
- Units: foundation, archetype-index, cluster-index (no siblings), gate-all, final — all done (stardust/rollout/progress.json).
- gate-all (aem.live, `--state stardust/.work/rollout/gate-all-state.json`, a one-row deployed state — the core state machine stops at `migrated`): 1440 1.6 % Δh 0, 360 3.3 % Δh −2, clipped 0 at both. Content MISSING 38 = the footer links only: the source's footer lives inside `<main>`, the EDS footer is chrome; `content-presence --chrome` finds all 38 served. Documented in `gates/all-<w>/overrides.json`. One 360 content read caught the page undecorated (docH 13767 vs 8922); a stand-alone re-run read 8922 — timing, not a defect.
- Font check: `poppins-fallback` declared `local('Arial')` only → dead on the Linux gate host. C-final added Helvetica / Liberation Sans sources; footer legal-row whitespace moved from related-articles into footer.css. Pushed e8cb23d; aem.page serves it, the aem.live edge (Cloudflare HIT, max-age 7200) still serves the old styles.css despite admin code + cache purges → re-gate in E-full-site.

## D-site — sitemap verified, root answers, scratch page removed (2026-11-12)
- `assemble.mjs --verify-origin` aem.live: served 1 = assembled 1, exit 0. `/` 200 on aem.page and aem.live; `/nav`, `/footer` live with noindex.
- No redirect rows (source root 200, no `/index.html`, no legacy paths in scope) → header-only `stardust/redirects.tsv`, no sheet. `/drafts/shell` (C0 scratch) unpreviewed + DA-deleted.

## D2-dynamic — parity replayed on aem.live, 5/5 checks pass (2026-11-12)
- `stardust/dynamics/parity.json`: 13 features — quote widget `interim` (tabs/panels/Buy now hand-off verified by dom-count), 6 owner-gated rows `scaffolded-awaiting-owner` (D1 quote backend, D2 tags), 5 static rows `done`, page-health no-page-errors.
- `dynamics-check.mjs --origin` aem.live: 5/5 PASS incl. martech gate (no tag host requested; 3 routes gated, all disabled). Report in stardust/qa/dynamics-report.md.

## E-full-site — home verified on aem.live, timed motion running (2026-11-12)
- Coverage row `index` set deployed (C-deliver had left it pending), then `verify.mjs --base` aem.live: 1/1 verified (200, links resolve, gate pass via the documented override).
- Render check, restoreAtDelivery entries: `gst-scroll` marquee running (currentTime 2850 → 4350 ms), `shine-move` running, `slide-up` finished (one-shot entrance) — all as on the source.
- Font re-gate still owed: aem.live edge serves the pre-C-final styles.css until its max-age (7200 s) lapses; re-run gate-all `--recapture-eds` before the handoff end.

## E2-link-audit — off-scope internal links repointed to the source, no 404 left (2026-11-12)
- Nav (36) and footer (76) root-relative hrefs to pages outside the one-page scope repointed to www.tataaig.com (named decision in direction.md); nav + footer re-published (deploy-batch, ledger-e2-chrome). `localize-links` reports nothing left to localize.
- Live audit: 137 unique hrefs, 132 → 200; 5 external hosts refuse the test network (403 / no answer), none internal.

## F-optimize — no P1; one P2 accepted as source parity (2026-11-12)
- `optimize.mjs --base` aem.live: health 90/100, P1 0, P2 1 (no JSON-LD). The source page carries no JSON-LD either; with an empty register the replica adds none → resolved `accepted`.

## G-aem — nothing to autofix (2026-11-12)
- `autofix-aem.mjs --dry-run`: 0 candidates (no open fixable findings) → no project edits, no re-deploy.

## H-report — delivery summary written (2026-11-12)
- `stardust/rollout/report.md` (1/1 page verified, 8 blocks verified, gate numbers, owner decisions D1/D2); `stardust/learnings.md` (6 entries). Block coverage rows flipped to verified.

## I-dashboard — dashboard written (2026-11-12)
- `stardust/rollout/dashboard/` (index.html + data.json): 1 page identified · prototyped · deployed · optimised.

## Handoff — run complete (2026-11-12)
- Font re-gate on aem.page (same content, C-final CSS): 1440 1.6 % Δh 0, 360 3.3 % Δh −2, fonts not loaded 0; content = the 38 footer links (granularity) only. The aem.live edge picks up the CSS when its 7200 s TTL lapses.
- Runner done-check: complete, no gaps.
