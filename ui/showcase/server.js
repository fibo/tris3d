import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { appName, baseStyle, emptyFavicon, metaThemeColor, metaViewport } from '@tris3d/design'
import { resetDir, openBrowser, workspaceDir } from '@tris3d/repo'
import { context } from 'esbuild'

const { ui: uiDir } = workspaceDir

const showcaseDir = join(uiDir, 'showcase')
const outdir = join(showcaseDir, 'out')

async function generateHtml() {
  // Get all HTML files in showcase directory.
  const files = await readdir(showcaseDir)
  for (let page of files.filter(filename => extname(filename) === '.html')) {
    const content = await readFile(join(uiDir, 'showcase', page), 'utf8')
    // Wrap the content in the HTML template.
    const output = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  {emptyFavicon}
  {metaViewport}
  {metaThemeColor}
  <title>{appName}</title>
  {baseStyle}
  <script type="module" src="load.js"></script>
</head>
<body>
  {content}
</body>
</html>
`
      .replace('{content}', content)
      .replace('{appName}', appName)
      .replace('{baseStyle}', baseStyle)
      .replace('{emptyFavicon}', emptyFavicon)
      .replace('{metaThemeColor}', metaThemeColor)
      .replace('{metaViewport}', metaViewport)
    await writeFile(join(outdir, page), output, 'utf8')
  }
}

async function startServer({ port }) {
  await resetDir(outdir)

  const ctx = await context({
    entryPoints: [join(uiDir, 'showcase', 'load.js')],
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
