import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { copyFile, readFile, rename, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { appName, appDescription, themeColor } from '@tris3d/design'
import { html } from '@tris3d/screens'
import { resetDir, isMainModule, workspaceDir } from '@tris3d/repo'
import { build as esbuild } from 'esbuild'

const WEBSOCKET_URL = process.env.WEBSOCKET_URL
if (!WEBSOCKET_URL) {
  console.error('Missing WEBSOCKET_URL environment variable')
  process.exit(1)
}

const BUCKET = process.env.BUCKET
if (!BUCKET) {
  console.error('Missing BUCKET environment variable')
  process.exit(1)
}

const srcDir = join(workspaceDir.pwa, 'src')
const outDir = join(workspaceDir.pwa, 'out')
const imagesDir = join(outDir, 'images')
const jsDir = join(outDir, 'js')

const pwaManifestPathname = 'manifest.json'

const htmlFilename = {
  index: 'index.html',
  pageNotFound: '404.html',
  telegramMiniApp: 'tma.html',
}

export const htmlFilepath = Object.entries(htmlFilename).reduce(
  (filepaths, [key, filename]) => ({
    [key]: join(outDir, filename),
    ...filepaths,
  }),
  {})

async function copyImages() {
  await resetDir(imagesDir)
  const designImagesDir = join(workspaceDir.design, 'images')
  await copyFile(join(designImagesDir, 'favicon.ico'), join(outDir, 'favicon.ico'))
  const logos = ['logo-180.png', 'logo-192.png', 'logo-512.png']
  for (const logo of logos)
    await copyFile(join(designImagesDir, logo), join(imagesDir, logo))
}

function computeChecksum(filepath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(filepath)
    stream.on('data', data => hash.update(data))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', reject)
  })
}

async function generateJs(entryPoint, { external = [], filename } = {}) {
  const outfile = join(outDir, filename ?? basename(entryPoint))
  await esbuild({
    bundle: true,
    define: {
      WEBSOCKET_URL: JSON.stringify(WEBSOCKET_URL),
    },
    entryPoints: [entryPoint],
    external,
    format: 'esm',
    legalComments: 'none',
    minify: true,
    outfile,
  })
  const checksum = await computeChecksum(outfile)
  const extension = extname(outfile)
  const checksumFilename = `${basename(outfile, extension)}-${checksum.slice(0, 8)}${extension}`
  await rename(outfile, join(jsDir, checksumFilename))
  return checksumFilename
}

export async function generateHtml() {
  await resetDir(jsDir)

  // Bundle @tris3d/three, add it to import map and mark it as external.
  const threeJs = await generateJs(join(workspaceDir.three, 'index.js'), { filename: 'three.js' })
  const importMap = JSON.stringify({
    imports: {
      '@tris3d/three': `./js/${threeJs}`,
    },
  })

  const jsCanvas = await generateJs(join(srcDir, 'canvas.js'), { external: ['@tris3d/three'] })
  const jsUi = await generateJs(join(srcDir, 'ui.js'))

  for (const [key, filename] of Object.entries(htmlFilename)) {
    const template = await readFile(join(srcDir, filename), 'utf8')
    await writeFile(
      htmlFilepath[key],
      html(template, {
        jsCanvas,
        jsUi,
        importMap,
        manifestPathname: pwaManifestPathname,
      })
      // Pretty good minification.
        .replace(/\n\s+/g, '\n')
        .replaceAll('\n', '')
        .trim(),
      'utf-8'
    )
  }
}

async function generatePwaManifest() {
  const content = JSON.stringify({
    name: appName,
    start_url: '.',
    description: appDescription,
    theme_color: themeColor,
    icons: [
      {
        src: 'images/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'images/logo-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  })
  await writeFile(join(outDir, pwaManifestPathname), content, 'utf-8')
}

async function generateTonconnectManifest() {
  const baseUrl = `https://${BUCKET}`
  const content = JSON.stringify({
    name: appName,
    url: `${baseUrl}/${htmlFilename.telegramMiniApp}`,
    iconUrl: `${baseUrl}/images/logo-180.png`,
    // privacyPolicyUrl: '',
    // termsOfUseUrl: '',
  })
  await writeFile(join(outDir, 'tonconnect-manifest.json'), content, 'utf-8')
}

export async function build() {
  await resetDir(outDir)

  await copyImages()

  await generatePwaManifest()
  await generateTonconnectManifest()

  await generateHtml()
}

if (isMainModule(import.meta.url)) {
  await build()
}
