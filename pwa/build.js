import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { copyFile, readFile, rename, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { appName, appDescription, baseStyle, metaThemeColor, metaViewport, themeColor } from '@tris3d/design'
import { resetDir, isMainModule, workspaceDir } from '@tris3d/repo'
import { build as esbuild } from 'esbuild'

const WEBSOCKET_URL = process.env.WEBSOCKET_URL
if (!WEBSOCKET_URL) {
  console.error('Missing WEBSOCKET_URL environment variable')
  process.exit(1)
}

const srcDir = join(workspaceDir.pwa, 'src')
const outDir = join(workspaceDir.pwa, 'out')
const imagesDir = join(outDir, 'images')
const jsDir = join(outDir, 'js')

const manifestPathname = 'manifest.json'

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

function html(content, { js = {}, importMap = {} } = {}) {
  return content
    .replaceAll('{appDescription}', appDescription)
    .replaceAll('{appName}', appName)
    .replace('{baseStyle}', baseStyle)
    .replace('{manifestPathname}', manifestPathname)
    .replace('{metaThemeColor}', metaThemeColor)
    .replace('{metaViewport}', metaViewport)
    .replace('{importMap}', importMap)
    .replace('{jsCanvas}', js.canvas)
    .replace('{jsUi}', js.ui)
    // Pretty good minification.
    .replace(/\n\s+/g, '\n')
    .replaceAll('\n', '')
    .trim()
}

async function copyImages() {
  await resetDir(imagesDir)
  const designImagesDir = join(workspaceDir.design, 'images')
  await copyFile(join(designImagesDir, 'favicon.ico'), join(outDir, 'favicon.ico'))
  await copyFile(join(designImagesDir, 'logo-192.png'), join(imagesDir, 'logo-192.png'))
  await copyFile(join(designImagesDir, 'logo-512.png'), join(imagesDir, 'logo-512.png'))
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

  const canvas = await generateJs(join(srcDir, 'canvas.js'), { external: ['@tris3d/three'] })
  const ui = await generateJs(join(srcDir, 'ui.js'))

  const js = {
    canvas,
    ui,
  }

  for (const [key, filename] of Object.entries(htmlFilename)) {
    const content = await readFile(join(srcDir, filename), 'utf8')
    await writeFile(
      htmlFilepath[key],
      html(content, { js, importMap }),
      'utf-8'
    )
  }
}

async function generateManifest() {
  const manifestContent = JSON.stringify({
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
  await writeFile(join(outDir, manifestPathname), manifestContent, 'utf-8')
}

export async function build() {
  await resetDir(outDir)

  await copyImages()
  await generateManifest()

  await generateHtml()
}

if (isMainModule(import.meta.url)) {
  await build()
}
