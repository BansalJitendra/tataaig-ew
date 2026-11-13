# Published-origin gate — all deployed pages, 1440px

2026-11-12T13:13:52.576Z · **0 PASS / 1 FAIL / 0 error of 1** (+1 documented override → 1 delivered)

Verdict: overlap pixel % ≤ 10 AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance) AND content MISSING + HIDDEN links/headings = 0

Calibration — pixel-only verdict (criteria 1+2): **1 PASS**; full verdict (1–4): **0 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 1, fonts not loaded 1 (poppins-fallback); content n/a (origin not probed) 0.
| page | template | tier | origin | browser | pixel % (text %) | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | landing | archetype | stitch-live | chrome | 1.6 (5.63) | 0 | 0 | MISSING 38 / HIDDEN 0 | - | FAIL (elements) → granularity: content MISSING = the 38 footer links only: the source renders its footer inside <main> (root main.Layout_main__E16O_), the EDS footer block sits outside <main>. content-presence --chrome finds all 38 on the served page (inChrome, ul.foot-links …) at 1440 and 360; footer.plain.html carries every href. Pixel, height and clip pass on their own; the font check is not covered by this entry. | content MISSING 38 / HIDDEN 0; font-not-loaded:poppins-fallback |
