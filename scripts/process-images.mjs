import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = 'public/images'
const WIDTHS = [1600, 1000, 640]

/**
 * Real photographs of Royal Public School, mapped to the slot names used by
 * <SmartImage>. The source files are the originals in public/images; each
 * export is lightly corrected (light, colour, contrast, sharpness) before it
 * is written as a responsive WebP set named `${name}-${width}.webp`.
 */
const PHOTOS = [
  // Independence Day assembly seen from above, students in tricolour caps.
  { name: 'hero-campus', src: 'photos/assembly-independence.jpeg', grade: { brightness: 1.05, saturation: 1.2, contrast: 1.06, sharpen: 1.1 } },
  // The school building across the checkered courtyard.
  { name: 'school-building', src: 'photos/school-building.jpeg', grade: { brightness: 1.06, saturation: 1.12, contrast: 1.06, sharpen: 1 } },
  // The main gate at dusk with its illuminated name sign.
  { name: 'school-gate', src: 'photos/school-gate-dusk.jpeg', grade: { brightness: 1.16, saturation: 1.15, contrast: 1.12, sharpen: 1.2 } },
  // The same gate in daylight.
  { name: 'gate-daylight', src: 'photos/school-gate-daylight.jpeg', grade: { brightness: 1.05, saturation: 1.1, contrast: 1.06, sharpen: 1 } },
  // A class group photograph in winter uniform.
  { name: 'class-group', src: 'photos/class-group.jpeg', grade: { brightness: 1.05, saturation: 1.12, contrast: 1.05, sharpen: 1 } },
  // Morning assembly drill on the school ground.
  { name: 'assembly-ground', src: 'photos/morning-assembly.jpeg', grade: { brightness: 1.06, saturation: 1.12, contrast: 1.07, sharpen: 1.1 } },
  // Students spelling RPS with coloured caps.
  { name: 'celebration-rps', src: 'photos/rps-formation.jpeg', grade: { brightness: 1.04, saturation: 1.2, contrast: 1.06, sharpen: 1.1 } },
  // Sardar Vallabhbhai Patel Jayanti group photograph.
  { name: 'patel-jayanti', src: 'photos/patel-jayanti.jpeg', grade: { brightness: 1.05, saturation: 1.1, contrast: 1.05, sharpen: 1.1 } },
  // Janmashtami celebration on stage.
  { name: 'janmashtami', src: 'photos/janmashtami.jpeg', grade: { brightness: 1.05, saturation: 1.12, contrast: 1.05, sharpen: 1 } },
]

function graded(pipeline, { brightness = 1.04, saturation = 1.1, contrast = 1.05 } = {}) {
  return pipeline
    .modulate({ brightness, saturation })
    .linear(contrast, -(128 * (contrast - 1)))
}

await mkdir(OUT, { recursive: true })

for (const photo of PHOTOS) {
  for (const width of WIDTHS) {
    const output = path.join(OUT, `${photo.name}-${width}.webp`)
    const pipeline = graded(sharp(photo.src).rotate(), photo.grade)
      .resize({ width, withoutEnlargement: true, kernel: 'lanczos3' })
      .sharpen({ sigma: photo.grade?.sharpen ?? 1, m1: 0.7, m2: 0.35 })
      .webp({ quality: 84, effort: 5, smartSubsample: true })
    await pipeline.toFile(output)
  }
  console.log(`processed ${photo.name}`)
}

const IG_SRC = path.join('vibe_images', 'instagram')
const IG_OUT = path.join(OUT, 'instagram')
await mkdir(IG_OUT, { recursive: true })

const { readdir } = await import('node:fs/promises')
const igFiles = (await readdir(IG_SRC)).filter((file) => /\.jpe?g$/i.test(file))

for (const file of igFiles) {
  const name = file.replace(/\.jpe?g$/i, '')
  await graded(sharp(path.join(IG_SRC, file)).rotate(), { brightness: 1.03, saturation: 1.08 })
    .resize({ width: 640, withoutEnlargement: true, kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8 })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(IG_OUT, `${name}.webp`))
  console.log(`processed instagram/${name}`)
}

await graded(sharp('photos/assembly-independence.jpeg').rotate(), { brightness: 1.05, saturation: 1.16, contrast: 1.05 })
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .sharpen({ sigma: 1 })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(OUT, 'og-royal-public-school.jpg'))
console.log('processed og image')
