import { exec } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import { join } from 'node:path'
import { appName, baseStyle, metaViewport, themeColor } from '@tris3d/design'
import { ensureDir, workspaceDir } from '@tris3d/repo'
import { context } from 'esbuild'

const { demo: demoDir } = workspaceDir

const outdir = join(demoDir, 'out')
const src = filename => join(demoDir, 'src', filename)

async function generateIndexHtml() {
  let content = await readFile(src('index.html'), 'utf8')
  content = content
    .replaceAll('${appName}', appName)
    .replace('${baseStyle}', baseStyle)
    .replaceAll('${themeColor}', themeColor)
    .replace('${metaViewport}', metaViewport)
  await writeFile(join(outdir, 'index.html'), content, 'utf8')
}

async function startServer({ port }) {
  await ensureDir(outdir)

  const ctx = await context({
    entryPoints: [src('app.js')],
    bundle: true,
    inject: [src('liveReload.js')],
    minify: false,
    outdir,
    plugins: [{
      name: 'html',
      setup(build) {
        build.onEnd(generateIndexHtml)
      }
    }],
  })

  await ctx.watch()

  await ctx.serve({
    servedir: join(outdir),
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
