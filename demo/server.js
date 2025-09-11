import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { appName, baseStyle, emptyFavicon, metaThemeColor, metaViewport } from '@tris3d/design'
import { ensureDir, openBrowser, workspaceDir } from '@tris3d/repo'
import { context } from 'esbuild'

const { demo: demoDir } = workspaceDir

const outdir = join(demoDir, 'out')
const src = filename => join(demoDir, 'src', filename)

async function generateIndexHtml() {
  let content = await readFile(src('index.html'), 'utf8')
  content = content
    .replaceAll('{appName}', appName)
    .replace('{baseStyle}', baseStyle)
    .replace('{emptyFavicon}', emptyFavicon)
    .replace('{metaThemeColor}', metaThemeColor)
    .replace('{metaViewport}', metaViewport)
  await writeFile(join(outdir, 'index.html'), content, 'utf8')
}

async function startServer({ port }) {
  await ensureDir(outdir)

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
