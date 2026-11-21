import { writeFile, mkdir } from 'node:fs/promises'

const base = (process.env.SITE_URL || 'https://rpsbaghpat.in').replace(/\/+$/, '')

const routes = [
  '/',
  '/about',
  '/vision-mission',
  '/academics',
  '/facilities',
  '/campus-life',
  '/gallery',
  '/updates',
  '/admissions',
  '/contact',
  '/privacy',
  '/terms',
]

const today = new Date().toISOString().slice(0, 10)

const urls = routes
  .map((route, index) => {
    const priority = route === '/' ? '1.0' : index < 9 ? '0.8' : '0.3'
    return `  <url>\n    <loc>${base}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`

await mkdir('public', { recursive: true })
await writeFile('public/sitemap.xml', sitemap)
await writeFile('public/robots.txt', robots)
console.log(`SEO files written for ${base}`)
