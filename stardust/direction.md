---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-12T10:51:48Z
  againstInput: https://www.tataaig.com/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.tataaig.com/,
synthesized minimally (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-11-12T10:51:48Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Hands-off: activated by `--hands-off` (runner invocation, 2026-11-12T10:51:48Z). Scope fixed to one page
(the home page, `/`); no volume caps apply. Gate breakpoints: desktop,mobile → 1440, 360.
Publish decision: publish (made by the owner up front). Martech: carried over, every contract part disabled.

## Decision — link targets outside the one-page scope (E2, 2026-11-12)
The run's page scope is fixed to the home page (`/`). Every other internal target linked from the home page, `/nav` and `/footer` is **scope extension** (outside the declared cap of one page), so it is repointed to its source URL on `https://www.tataaig.com` rather than left as a root-relative 404: 36 nav hrefs and 76 footer hrefs repointed (the page body already carried absolute source URLs — 50 of them, incl. the source's own `/!#` "Learn more" placeholders, kept verbatim). `/` stays root-relative. Live link audit after re-publish: 137 unique hrefs, 132 → 200, 5 external hosts refuse the probe (shebox.wcd.gov.in 403, ckycindia.in 403, linkedin.com 403, agencyportal.irdai.gov.in and healthid.ndhm.gov.in no answer from the test network) — external, unchanged from the source, no internal 404.
