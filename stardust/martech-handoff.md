# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `www.tataaig.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** none detected
- **Model `owner-decision`:** no evidence of consent gating inside the tag manager. Keep the source behaviour (route `category` null), or set a route `category` to a consent group id to load that tag manager only once the group is granted.
- **Categories:** no CMP configuration read — run `spec-martech.mjs` first, or decide categories with the owner.

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| google-tag-manager | Google Tag Manager | `https://www.googletagmanager.com/gtm.js?id=GTM-TD2BW4B&gtg_health=1` | — | false |
| adobe-dtm | Adobe DTM satelliteLib (legacy Launch predecessor; loads AppMeasurement) | `https://assets.adobedtm.com/71e40a7fa2004bdcd064f8678cb1edff1296d129/satelliteLib-3430d8df4df83855f4165b0338a2ef8ff0b28afa.js` | — | false |
| moengage | MoEngage Web SDK via the site's `/js/moengage_prod.js` init (rehost before enabling) | `https://www.tataaig.com/js/moengage_prod.js` | — | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): tag manager: Adobe Launch · analytics: Google Analytics / Ads · RUM: Dynatrace · marketing: ad / retargeting pixel.

## Rewrite before go-live

Nothing found (or no tag-manager library read).

## Data layer

The source pages expose `dataLayer`, `digitalData`; keep the same global names.
Rules in Adobe Launch, Google Tag Manager were not parsed. Read each library listed in `martech/tags.json` and record its rules and data elements in the contract's `tagNotes`, keyed by tag manager, each citing where it was read (`from`); until then their triggers and events come from the tagging plan.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.
