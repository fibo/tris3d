import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { copyFile, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { appName, appDescription, baseStyle, metaThemeColor, metaViewport, themeColor } from '@tris3d/design'
import { ensureDir, isMainModule, workspaceDir } from '@tris3d/repo'
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
const indexHtmlFilename = 'index.html'
const pageNotFoundFilename = '404.html'
export const indexHtmlFilepath = join(outDir, indexHtmlFilename)
export const pageNotFoundFilepath = join(outDir, pageNotFoundFilename)

function html(content, js = {}) {
  return content
    .replaceAll('${appDescription}', appDescription)
    .replaceAll('${appName}', appName)
    .replace('${baseStyle}', baseStyle)
    .replace('${manifestPathname}', manifestPathname)
    .replace('${metaThemeColor}', metaThemeColor)
    .replace('${metaViewport}', metaViewport)
    .replace('${jsCanvas}', js.canvas)
    .replace('${jsUi}', js.ui)
    // Pretty good minification.
    .replace(/\n\s+/g, '\n')
    .replaceAll('\n', '')
    .trim()
}

async function copyImages() {
  await ensureDir(imagesDir)
  const designImagesDir = join(workspaceDir.design, 'images')
  await copyFile(join(designImagesDir, 'favicon.ico'), join(outDir, 'favicon.ico'))
  await copyFile(join(designImagesDir, 'logo-192.png'), join(imagesDir, 'logo-192.png'))
  await copyFile(join(designImagesDir, 'logo-512.png'), join(imagesDir, 'logo-512.png'))
}

async function pageNotFoundHtml() {
  const content = await readFile(join(srcDir, pageNotFoundFilename), 'utf8')
  return html(content)
}

async function indexHtml(js) {
  const content = await readFile(join(srcDir, indexHtmlFilename), 'utf8')
  return html(content, js)
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

async function generateJs(filename) {
  const outfile = join(outDir, filename)
  await esbuild({
    define: {
      WEBSOCKET_URL: JSON.stringify(WEBSOCKET_URL),
    },
    entryPoints: [join(srcDir, filename)],
    external: ['@tris3d/three'],
    bundle: true,
    minify: true,
    outfile,
  })
  const checksum = await computeChecksum(outfile)
  const checksumFilename = `${filename.replace('.js', '')}-${checksum.slice(0, 8)}.js`
  await rename(outfile, join(jsDir, checksumFilename))
  return checksumFilename
}

export async function generateHtml() {
  await ensureDir(jsDir)
  const canvas = await generateJs('canvas.js')
  const ui = await generateJs('ui.js')
  const js = {
    canvas,
    ui,
  }
  const indexContent = await indexHtml(js)
  await writeFile(indexHtmlFilepath, indexContent, 'utf-8')

  const pageNotFoundContent = await pageNotFoundHtml({ appName })
  await writeFile(pageNotFoundFilepath, pageNotFoundContent, 'utf-8')
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
  await ensureDir(outDir)

  await copyImages()
  await generateManifest()

  await generateHtml()
}

if (isMainModule(import.meta.url)) {
  await build()
}
