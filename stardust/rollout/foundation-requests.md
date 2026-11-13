- archetype-index | main sits 10px up at width <= 767 (prototype index.css `.main { top: -10px }`, footer inside main on the source) — styles.css has no equivalent | secy probe @360: every home block +10px vs prototype; Δh needs the 10px returned under the footer | index
- archetype-index | footer legal links: delivered `<ul>` carries whitespace between inline `<li>`s, the source has none — the row wraps differently | kids probe @360: .foot-legal-links 202px vs prototype 250px (footer -48px, page Δh -47) | index
- archetype-index | header root `#fixHeader` computes `position: relative` (the sticky lives on the `header` wrapper), so chrome-compare classifies the build header as static while it pins exactly like the source (top 55 → 0, in view) | chrome-compare header-contract vs stardust/chrome/header-build-home.json: 4 🔴 scroll-state@1440 (samples top 55/0/0/55 on both) | index
- gate-all | poppins-fallback @font-face resolves only local('Arial'); on a host without Arial (the gate's Linux Chrome) the face is dead and the row fails font-not-loaded:poppins-fallback — add the metric-compatible local('Liberation Sans') / local('Helvetica') sources after Arial | gate-all.mjs 1440+360: eds.capture.json fontsFailed [poppins-fallback]; fc-list has Liberation Sans, no Arial | index

## Applied at C-final (2026-11-12)
- footer legal row whitespace → applied in blocks/footer/footer.css; the scoped copy in blocks/related-articles/related-articles.css removed.
- poppins-fallback local() sources → applied in styles/styles.css (Arial, Helvetica, Liberation Sans).
- main offset at <= 767 → kept as the quote-hero block's scoped rule: it belongs to the home layout (the hero is the first block), styles.css carries no page-level main offset; gate 360 Δh -2 with it.
- header root `position: relative` classification → no change: the instrument reads `#fixHeader` while the sticky lives on its `header` wrapper; the samples pin 55 → 0 on both sides (chrome-compare scroll-state).
