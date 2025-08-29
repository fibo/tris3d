import { copyFile, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { appName, appDescription, baseStyle, themeColor } from '@tris3d/design'
import { ensureDir, isMainModule, workspaceDir } from '@tris3d/repo'

const outDir = join(workspaceDir.pwa, 'out')
const srcDir = join(workspaceDir.pwa, 'src')
const imagesDir = join(outDir, 'images')

const manifestPathname = 'manifest.json'
const indexHtmlFilename = 'index.html'
const pageNotFoundFilename = '404.html'
export const indexHtmlFilepath = join(outDir, indexHtmlFilename)
export const pageNotFoundFilepath = join(outDir, pageNotFoundFilename)

/** Pretty good minification. */
function minified(content) {
  return content
    .replace(/\n\s+/g, '\n')
    .replaceAll('\n', '')
    .trim()
}

async function copyImages() {
  const designImagesDir = join(workspaceDir.design, 'images')
  await copyFile(join(designImagesDir, 'favicon.ico'), join(outDir, 'favicon.ico'))
  await copyFile(join(designImagesDir, 'logo-192.png'), join(imagesDir, 'logo-192.png'))
  await copyFile(join(designImagesDir, 'logo-512.png'), join(imagesDir, 'logo-512.png'))
}

async function pageNotFoundHtml() {
  const content = await readFile(join(srcDir, pageNotFoundFilename), 'utf8')
  return minified(content
    .replaceAll('${appName}', appName)
    .replace('${baseStyle}', baseStyle)
  )
}

async function indexHtml() {
  const content = await readFile(join(srcDir, indexHtmlFilename), 'utf8')
  return minified(content
    .replaceAll('${appName}', appName)
    .replaceAll('${appDescription}', appDescription)
    .replaceAll('${themeColor}', themeColor)
    .replace('${manifestPathname}', manifestPathname)
    .replace('${baseStyle}', baseStyle)
  )
}

export async function generateHtml() {
  const indexContent = await indexHtml()
  await writeFile(indexHtmlFilepath, indexContent, 'utf-8')
  const pageNotFoundContent = await pageNotFoundHtml({ appName })
  await writeFile(pageNotFoundFilepath, pageNotFoundContent, 'utf-8')
}

async function generateManifest() {
  const manifestContent = JSON.stringify({
    name: appName,
    start_url: '.',
    description: appDescription,
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
  await ensureDir(imagesDir)

  await copyImages()

  await generateManifest()
  await generateHtml()
}

if (isMainModule(import.meta.url)) {
  await build()
}
