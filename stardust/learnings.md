# Learnings — tataaig.com replica (2026-11-12)

- **The core state machine stops at `migrated`, gate-all selects `deployed` + `liveUrl`.** A run that never writes a deployed state row gets "no deployed pages selected"; a one-row `--state` file (`slug, url, status: deployed, liveUrl`) feeds gate-all without touching `state.json`.
- **Coverage rows are not flipped by deploy-batch.** C-deliver left `index` pending and every block pending; `update-coverage.mjs <slug> --status deployed --url …` and `--block <id> --status verified` were needed before `verify.mjs` saw anything.
- **A `local('Arial')`-only fallback face fails the gate's font check on Linux** (no Arial installed): list the Arial-metric faces (`Helvetica`, `Liberation Sans`) too.
- **The aem.live edge holds code for its max-age** (Cloudflare HIT, 7200 s) after a push even past admin `code` + `cache` POSTs — gate on aem.page or wait out the TTL before a published-origin re-gate of a CSS change.
- **A source footer inside `<main>` reads as 38 MISSING links** to content-presence (EDS footer is chrome): verify with `--chrome` and document the granularity override.
- **One-page scope means every chrome link is scope extension**: repoint nav/footer root-relative hrefs to the source before publish, or they 404 on the new origin.
