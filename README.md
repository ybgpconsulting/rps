# Royal Public School — website

Marketing site for Royal Public School, Samadi Road, Tatiri, Baghpat (UP). Built with React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, and React Three Fiber.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run lint       # oxlint
npm run typecheck  # TypeScript checks for browser and Worker code
npm test           # Node's built-in test runner (no extra runtime dependencies)
npm run build      # SEO files + typecheck + production build to dist/client
npm run preview    # run the Worker and static assets locally
npm run deploy     # clear stale cf output, build, and deploy the Worker (does not run migrations)
npm run db:migrate # apply production D1 migrations separately; review before use
npm run db:migrate:preview # apply migrations only to the separately provisioned preview database
npm run build:images  # regenerate responsive WebP images from photos/ and vibe_images/instagram/
```

## Deployment

The site is configured as a Cloudflare Worker with static assets. The Worker provides the D1-backed content API, announcement pages, and server-delivered route metadata; `wrangler.jsonc` routes page/API requests through the Worker while fingerprinted assets are served directly. The production host is `theroyalpublicschool.in`, attached through a Worker route over its existing proxied DNS. `npm run dev` runs the browser-only Vite site; the admin editor saves text changes to browser storage in this mode. `npm run preview` runs the Worker and assets locally.

### Admin panel and publishing

- Open `/admin` to update school contact details, the homepage headline, gallery photos, school announcements, and Instagram, Facebook, Google Maps, and Google reviews links.
- Gallery uploads accept JPG, PNG, and WebP files up to 8 MB each. R2 is not bound in the current Worker configuration; uploads, media reads, and cleanup remain unavailable until the production `SITE_MEDIA` bucket is provisioned and bound. Once enabled, removing a photo attempts deletion only after confirming it is not referenced by published content or any announcement.
- The public `/updates` page lists current announcements and holidays without a login. Staff can create drafts, publish immediately, schedule by IST date and time, pin notices, add effective/expiry dates, preview, attach up to five PDFs or images, and archive older notices. Published notices appear on the site automatically at their scheduled time; publishing does not rebuild or redeploy the site. Each notice has a public `/updates/<name>` link, and published announcements appear in the dynamic sitemap.
- Drafts and future scheduled notices remain private. Expired and manually archived notices leave the current feed, remain available from the archive and their direct URLs, and remain in the dynamic sitemap. Deleting a notice removes its direct URL and sitemap entry.
- Update attachments accept PDF files up to 15 MB and JPG, PNG, or WebP images up to 8 MB. The Worker checks file signatures and generates non-guessable R2 object names.
- Production publishing writes the validated content document to the `SITE_CONTENT` D1 binding. Public visitors read the published document from `/api/content`.
- Local development is intentionally browser-only and clearly labeled; local edits do not change the live site.
- The Worker verifies the Cloudflare Access JWT signature, issuer, audience, expiry, and administrator email before returning admin identity or accepting any admin content, update, or file operation. Configure `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, and `ADMIN_EMAIL` as Worker variables; admin access fails closed until they are set.
- Public content renders immediately from the built-in validated defaults. Published D1 content loads asynchronously and replaces defaults only after validation.
- The service worker caches only fingerprinted same-origin build assets. It never caches APIs, admin paths, or media responses; offline navigations show a minimal contact page.
- `site-config.mjs` is the canonical site URL source used by the app, HTML metadata, and sitemap generation.

### CI and repository protection

GitHub Actions runs `npm ci`, TypeScript checks, lint, the Node test suite, and the production build on pull requests and pushes to `main` or `feat/*`. Configure branch protection in GitHub repository settings separately: require the `verify` job to pass before merging, disallow force pushes, and require pull requests. Branch protection is a GitHub account setting and is not changed by this repository.

Before deploying:

1. Verify the Cloudflare account and production D1 database ID in [`wrangler.jsonc`](./wrangler.jsonc). Apply migrations 0001–0003 to that database before deploying code that reads or writes D1; migrations are separate from `npm run deploy`.
2. Before enabling uploads, create the R2 bucket (currently intended name: `royal-public-school-media`) and add the `SITE_MEDIA` binding to the Worker configuration. Until this is done, existing media URLs and all upload/cleanup operations will not work.
3. Configure `ACCESS_TEAM_DOMAIN` (for example, `school.cloudflareaccess.com`), `ACCESS_AUD` (the Access application audience tag), and `ADMIN_EMAIL` (the single allowed administrator email) as Worker variables:
   ```jsonc
   "vars": {
     "ACCESS_TEAM_DOMAIN": "your-team.cloudflareaccess.com",
     "ACCESS_AUD": "your-access-application-audience",
     "ADMIN_EMAIL": "school-admin@example.com"
   }
   ```
4. Protect `/admin*` and `/api/admin/*` with a Cloudflare Access application restricted to the approved administrator. Do **not** protect `/api/content` or `/api/updates/*`; visitors need those endpoints.
5. Confirm the `theroyalpublicschool.in` zone is active in the intended account and the apex DNS record is proxied through Cloudflare; the Worker route depends on both. Preserve existing DNS records. Preview D1/R2 bindings are declared by name only and have not been verified or provisioned; do not deploy the preview environment until its resource IDs and Access settings are confirmed.
6. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. Review and apply migrations to the verified D1 as a separate approved step, then deploy with `npm run deploy`. This command does not run migrations.

Cloudflare credentials and Access values are account-specific and are not committed. The deploy script removes only the generated `.cloudflare/output` directory because it belongs to the separate `cf` build workflow and prevents Wrangler deployment; it also preserves dashboard-configured Worker variables. Preview resource provisioning remains unverified. A Worker code rollback does not reverse D1 migrations. If a migration needs correction, keep the schema additive/backward-compatible, deploy a corrective forward migration, and retain the prior migration tables; restore a database backup only through an explicitly approved recovery procedure.

## Content and launch checklist

The site is intentionally conservative about unverified facts. Before launch, replace the following:

- **Photography** — the site uses the school's own photographs. Originals live in `photos/` (outside the build, so they are never shipped) and are compiled to responsive WebP sets in `public/images/` by `scripts/process-images.mjs`. To swap a photo, replace the matching file in `photos/` and run `npm run build:images`; new gallery photos can be uploaded from `/admin`.
- **Instagram** — the section links to [@royalpublicschool_](https://www.instagram.com/royalpublicschool_/) and shows curated posts. Post links, captions, and image references can be updated in the admin editor. Add replacement image files to `vibe_images/instagram/` and run `npm run build:images` to compile them.
- **Principal's message** — name, portrait, and quotation are placeholders. Approval required before publishing.
- **CBSE affiliation** — no affiliation number or claim is displayed. Add it only once verified, in `src/data.ts`.
- **School timings** — not published; the site asks visitors to call the office.
- **Testimonials** — intentionally omitted. Add only genuine, permissioned parent quotes.
- **Contact details and links** — phone, address, WhatsApp number, Instagram, Facebook, Google Maps, and Google reviews links are editable from `/admin`.

## Notes

- Language: English/Hindi toggle, persisted in `localStorage` (`rps-lang`). Copy lives in `src/i18n.tsx`.
- Enquiries open a pre-filled WhatsApp chat; nothing is stored by the site. The success state appears only after WhatsApp is opened.
- Instagram cards are locally hosted thumbnails of public posts and link out to Instagram; the site does not auto-load Instagram embeds or trackers.
- The 3D hero loads lazily at ≥1024px and is disabled for `prefers-reduced-motion`.
