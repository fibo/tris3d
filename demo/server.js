import { exec } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import { join } from 'node:path'
import { appName, baseStyle, themeColor } from '@tris3d/design'
import { ensureDir, workspaceDir } from '@tris3d/repo'
import { context } from 'esbuild'

const { demo: demoDir } = workspaceDir

const outDir = join(demoDir, 'out')
const srcDir = join(demoDir, 'src')

async function generateHtml() {
  let content = await readFile(join(srcDir, 'index.html'), 'utf8')
  content = content
    .replace('${appName}', appName)
    .replace('${baseStyle}', baseStyle)
    .replace('${themeColor}', themeColor)
  await writeFile(join(outDir, 'index.html'), content, 'utf8')
}

async function startServer({ port }) {
  await ensureDir(outDir)
  await generateHtml()

  const ctx = await context({
    entryPoints: [join(srcDir, 'app.js')],
    bundle: true,
    inject: [join(srcDir, 'liveReload.js')],
    minify: false,
    outfile: join(outDir, 'app.js'),
  })

  await ctx.watch()

  await ctx.serve({
    servedir: join(outDir),
    port,
  })
}

function openBrowser({ port }) {
  const baseUrl = `http://localhost:${port}/`
  switch (os.platform()) {
    case 'darwin': exec(`open ${baseUrl}`)
    case 'linux': exec(`xdg-open ${baseUrl}`)
    case 'win32': exec(`start ${baseUrl}`)
    default: console.info(`Server started on ${baseUrl}`)
  }
}

const port = 3000

await startServer({ port })

openBrowser({ port })
