import sharp from 'sharp'
import { readdir, stat, writeFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ASSETS_DIR = join(__dirname, '../src/assets')

const JPEG_QUALITY = 80
const PNG_COMPRESSION = 9
const WEBP_QUALITY = 80

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await findImages(full))
    } else {
      const ext = extname(entry.name).toLowerCase()
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        files.push(full)
      }
    }
  }
  return files
}

async function optimizeImage(file) {
  const before = (await stat(file)).size
  const ext = extname(file).toLowerCase()
  const img = sharp(file)

  let buffer
  if (ext === '.jpg' || ext === '.jpeg') {
    buffer = await img.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer()
  } else if (ext === '.png') {
    buffer = await img.png({ compressionLevel: PNG_COMPRESSION }).toBuffer()
  } else if (ext === '.webp') {
    buffer = await img.webp({ quality: WEBP_QUALITY }).toBuffer()
  }

  if (!buffer) return { file, before, after: before, skipped: true }

  if (buffer.length < before) {
    await writeFile(file, buffer)
    return { file, before, after: buffer.length }
  }

  return { file, before, after: before, skipped: true }
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB'
}

const files = await findImages(ASSETS_DIR)
console.log(`\nOptimizing ${files.length} images in src/assets...\n`)

let totalBefore = 0
let totalAfter = 0
let optimized = 0
let skipped = 0

for (const file of files) {
  const result = await optimizeImage(file)
  const rel = file.replace(ASSETS_DIR + '/', '')
  totalBefore += result.before
  totalAfter += result.after

  if (result.skipped) {
    skipped++
  } else {
    optimized++
    const saving = ((1 - result.after / result.before) * 100).toFixed(1)
    console.log(`✓ ${rel}  ${formatBytes(result.before)} → ${formatBytes(result.after)}  (${saving}% kleiner)`)
  }
}

const totalSaving = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
console.log(`\n─────────────────────────────────────────────────`)
console.log(`${optimized} geoptimaliseerd  •  ${skipped} al optimaal`)
console.log(`Totaal: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)}  (${formatBytes(totalBefore - totalAfter)} bespaard, ${totalSaving}%)`)
console.log(`─────────────────────────────────────────────────\n`)
