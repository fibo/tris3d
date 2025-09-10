import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { appName, baseStyle, emptyFavicon, metaThemeColor, metaViewport } from '@tris3d/design'
import { ensureDir, openBrowser, workspaceDir } from '@tris3d/repo'
import { context } from 'esbuild'

const { ui: uiDir } = workspaceDir

const outdir = join(uiDir, 'out')

async function generateHtml() {
  let content = await readFile(join(uiDir, 'showcase', 'index.html'), 'utf8')
  content = content
    .replaceAll('${appName}', appName)
    .replace('${baseStyle}', baseStyle)
    .replace('${emptyFavicon}', emptyFavicon)
    .replace('${metaThemeColor}', metaThemeColor)
    .replace('${metaViewport}', metaViewport)
  await writeFile(join(outdir, 'index.html'), content, 'utf8')
}

async function startServer({ port }) {
  await ensureDir(outdir)

  const ctx = await context({
    entryPoints: [join(uiDir, 'showcase', 'elements.js')],
    bundle: true,
    format: 'esm',
    inject: [join(workspaceDir.repo, 'src', 'liveReload.js')],
    minify: false,
    outdir,
    plugins: [{
      name: 'html',
      setup(build) {
        build.onEnd(generateHtml)
      }
    }],
  })

  await ctx.watch()

  await ctx.serve({
    servedir: join(outdir),
    port,
  })
}

const port = 4000

await startServer({ port })

openBrowser({ port })
