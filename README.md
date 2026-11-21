# Royal Public School — website

Marketing site for Royal Public School, Samadi Road, Tatiri, Baghpat (UP). Built with React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, and React Three Fiber.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run lint       # oxlint
npm run typecheck  # TypeScript checks for browser and Pages Function code
npm test           # Node's built-in test runner (no extra runtime dependencies)
npm run build      # SEO files + typecheck + production build to dist/client
npm run preview    # serve the build and Pages Functions locally
npm run deploy     # build and deploy to Cloudflare Pages (does not run migrations)
npm run db:migrate # apply production D1 migrations separately; review before use
npm run db:migrate:preview # apply migrations only to the separately provisioned preview database
npm run build:images  # regenerate responsive WebP images from photos/ and vibe_images/instagram/
```

## Deployment

The site is deployed to Cloudflare Pages. Pages Functions provide the D1-backed content API, R2-hosted gallery uploads, announcement pages, and server-delivered route metadata. The Pages `_routes.json` sends public page routes, admin pages, APIs, media, and the sitemap through the Function; build assets remain static. `npm run dev` runs the public site locally; the admin editor saves text changes to browser storage in this mode. `npm run preview` serves the production build with Pages Functions locally.

### Admin panel and publishing

- Open `/admin` to update school contact details, the homepage headline, gallery photos, school announcements, and Instagram, Facebook, Google Maps, and Google reviews links.
- Gallery uploads accept JPG, PNG, and WebP files up to 8 MB each. Photos are stored in the `SITE_MEDIA` R2 bucket and served publicly for the school gallery. Removing a photo from published content attempts to delete it from R2 only after confirming it is not used by published content or any announcement; otherwise it is retained.
- The public `/updates` page lists current announcements and holidays without a login. Staff can create drafts, publish immediately, schedule by IST date and time, pin notices, add effective/expiry dates, preview, attach up to five PDFs or images, and archive older notices. Published notices appear on the site automatically at their scheduled time; publishing does not rebuild or redeploy the site. Each notice has a public `/updates/<name>` link, and published announcements appear in the dynamic sitemap.
- Drafts and future scheduled notices remain private. Expired and manually archived notices leave the current feed, remain available from the archive and their direct URLs, and remain in the dynamic sitemap. Deleting a notice removes its direct URL and sitemap entry.
- Update attachments accept PDF files up to 15 MB and JPG, PNG, or WebP images up to 8 MB. The Pages Function checks file signatures and generates non-guessable R2 object names.
- Production publishing writes the validated content document to the `SITE_CONTENT` D1 binding. Public visitors read the published document from `/api/content`.
- Local development is intentionally browser-only and clearly labeled; local edits do not change the live site.
- The Pages Function verifies the Cloudflare Access JWT signature, issuer, audience, expiry, and administrator email before returning admin identity or accepting any admin content, update, or file operation. The admin interface itself contains no secrets.
- Public content renders immediately from the built-in validated defaults. Published D1 content loads asynchronously and replaces defaults only after validation.
- The service worker caches only fingerprinted same-origin build assets. It never caches APIs, admin paths, or media responses; offline navigations show a minimal contact page.
- `site-config.mjs` is the canonical site URL source used by the app, HTML metadata, and sitemap generation.

### CI and repository protection

GitHub Actions runs `npm ci`, TypeScript checks, lint, the Node test suite, and the production build on pull requests and pushes to `main` or `feat/*`. Configure branch protection in GitHub repository settings separately: require the `verify` job to pass before merging, disallow force pushes, and require pull requests. Branch protection is a GitHub account setting and is not changed by this repository.

Before deploying:

1. Create or select the Cloudflare Pages project named `royalpublicschool-tatiri`. Create the production D1 database with `npx wrangler d1 create royal-public-school-content` or identify its existing ID, then set the returned/existing `database_id` in the production `SITE_CONTENT` binding in [`wrangler.jsonc`](./wrangler.jsonc). Create the R2 bucket before deployment with `npx wrangler r2 bucket create royal-public-school-media`; it is bound as `SITE_MEDIA`.
2. Set the Pages Function variables `ACCESS_TEAM_DOMAIN` (for example, `school.cloudflareaccess.com`), `ACCESS_AUD` (the Access application audience tag), and `ADMIN_EMAIL` (the single allowed administrator email). The Wrangler file is the Pages configuration source of truth, so define these non-secret values in its `vars` section before deployment:
   ```jsonc
   "vars": {
     "ACCESS_TEAM_DOMAIN": "your-team.cloudflareaccess.com",
     "ACCESS_AUD": "your-access-application-audience",
     "ADMIN_EMAIL": "school-admin@example.com"
   }
   ```
3. Create a Cloudflare Access self-hosted application for `/admin*` and `/api/admin/*`. Its allow policy should be limited to the administrator email. Do **not** protect `/api/content`, `/api/updates/*`, or `/media/*`; visitors need them to load published content, updates, and gallery photos.
4. Create an isolated preview D1 database and R2 bucket named `royal-public-school-content-preview` and `royal-public-school-media-preview`. The `env.preview` bindings in Wrangler are intentionally separate from production. Confirm the preview database binding points to the preview database before enabling preview deployments. Add the preview Access values in the Pages Preview environment; leave admin unpublished until `/api/admin/session` verifies the intended identity.
5. Before a preview launch, verify the preview D1 database and R2 bucket exist and run `npm run db:migrate:preview` to apply migrations only to the configured preview database. Before production launch, review the backward-compatible migrations and run `npm run db:migrate` as a separate, explicitly approved operation. Apply `0003_media_cleanup.sql` to the intended database before deploying code that uses the media-reference ledger. Deploy the site separately with `npm run deploy`; it does not migrate the database. Publishing subsequent announcements writes directly to D1 and does not require another deployment.

Production credentials, D1 IDs, Cloudflare Access values, and actual preview resource provisioning are account-specific and are not committed. Keep previews disabled until the separate preview resources and Access policy are configured and verified. A Pages code rollback does not reverse D1 migrations. If a migration needs correction, keep the schema additive/backward-compatible, deploy a corrective forward migration, and retain the prior migration tables; restore a database backup only through an explicitly approved recovery procedure.

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
