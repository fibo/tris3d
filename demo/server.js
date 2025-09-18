import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { resetDir, openBrowser, workspaceDir } from '@tris3d/repo'
import { html } from '@tris3d/screens'
import { context } from 'esbuild'

const { demo: demoDir } = workspaceDir

const outdir = join(demoDir, 'out')
const src = filename => join(demoDir, 'src', filename)

async function generateIndexHtml() {
  const template = await readFile(src('index.html'), 'utf8')
  await writeFile(join(outdir, 'index.html'), html(template), 'utf8')
}

async function startServer({ port }) {
  await resetDir(outdir)

  const ctx = await context({
    entryPoints: [src('app.js')],
    bundle: true,
    define: {
      WEBSOCKET_URL: JSON.stringify('ws://localhost:3456'),
    },
    format: 'esm',
    inject: [join(workspaceDir.repo, 'src', 'liveReload.js')],
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

const port = 3000

await startServer({ port })

openBrowser({ port })
