import { copyFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { appName, appDescription, fontFamily, themeColor } from '@tris3d/design'
import { ensureDir, isMainModule, workspaceDir } from '@tris3d/repo'
import { indexHtml } from '#src/html.js'

const outDir = join(workspaceDir.pwa, 'out')
const imagesDir = join(outDir, 'images')

async function copyImages() {
  const designImagesDir = join(workspaceDir.design, 'images')
  await copyFile(join(designImagesDir, 'favicon.ico'), join(outDir, 'favicon.ico'))
  await copyFile(join(designImagesDir, 'logo-192.png'), join(imagesDir, 'logo-192.png'))
  await copyFile(join(designImagesDir, 'logo-512.png'), join(imagesDir, 'logo-512.png'))
}

async function generateHtml({
  manifestJson,
}) {
  await writeFile(
    join(outDir, 'index.html'),
    indexHtml({
      appName,
      appDescription,
      fontFamily,
      themeColor,
      manifestJson,
    }), 'utf-8')
}

async function generateManifest() {
  const manifestPathname = 'manifest.json'
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
  return manifestPathname
}

export async function build() {
  await ensureDir(outDir)
  await ensureDir(imagesDir)

  await copyImages()

  const manifestPathname = await generateManifest()
  await generateHtml({ manifestPathname })
}

if (isMainModule(import.meta.url)) {
  await build()
}
