import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

await rm(resolve(process.cwd(), '.cloudflare', 'output'), {
  recursive: true,
  force: true,
})
