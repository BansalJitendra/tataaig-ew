# Dynamics parity check — https://main--0484faa8--aemcoder.aem.live — 2026-11-12T13:24:38.265Z

Replayed 5 checks over 14 features · pass 5 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| product quote tabs + registration form | F | interim | dom-count | PASS | 5 × .quote-hero [role=tab] (min 5) |  |
| product quote tabs + registration form | F | interim | dom-count | PASS | 5 × .quote-hero [role=tabpanel] (min 5) |  |
| product quote tabs + registration form | F | interim | dom-count | PASS | 4 × .quote-hero .quote-card-btn (min 4) |  |
| no uncaught errors on the delivered page | CR | done | no-page-errors | PASS | none on 1 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (3 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- reCAPTCHA on the quote form (F) — scaffolded-awaiting-owner · owner: D1 — arrives with the quote backend
- quote-form lookups (RTO, country, restricted countries) (A) — scaffolded-awaiting-owner · owner: D1 — host-bound on www.tataaig.com; not needed by the interim hand-off
- POST saveData (quote save) (S) — scaffolded-awaiting-owner · owner: D1
- Next.js route prefetches (A) — done
- digitalData / dataLayer / __NEXT_DATA__ (A) — done
- Next.js client framework (CR) — done
- Why TATA AIG + Our Products card groups (L) — done
- Adobe DTM / AppMeasurement, GTM, Dynatrace (T) — scaffolded-awaiting-owner · owner: D2 — enable martech contract parts on the new host
- MoEngage web SDK (T) — scaffolded-awaiting-owner · owner: D2 — martech route moengage, disabled
- VWO / OpenAI loaded by the tag stack (T) — scaffolded-awaiting-owner · owner: D2 — arrive through the tag managers when enabled
- tag-injected iframe (V) — scaffolded-awaiting-owner · owner: D2 — arrives with the tags
