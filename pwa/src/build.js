import { writeFile } from 'node:fs/promises'
import { ensureDir, isMainModule } from '@tris3d/repo'
import { indexHtml } from './html.js'
import { filepath, outDir } from './package.js'

async function generateHtml() {
  await ensureDir(outDir)
  await writeFile(filepath.indexHtml, indexHtml(), 'utf-8')
}

export async function build() {
  await generateHtml()
}

if (isMainModule(import.meta.url)) {
  await build()
}
