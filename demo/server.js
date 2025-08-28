import { exec } from 'node:child_process'
import os from 'node:os'
import { join } from 'node:path'
import { ensureDir } from '@tris3d/repo'
import { context } from 'esbuild'
import { outDir, srcDir } from './src/package.js'

async function startServer({ port }) {
  await ensureDir(outDir)

  const ctx = await context({
    entryPoints: [join(srcDir, 'app.js')],
    bundle: true,
    inject: [join(srcDir, 'liveReload.js')],
    minify: false,
    outfile: join(outDir, 'app.js'),
  })

  await ctx.watch()

  await ctx.serve({
    servedir: join(demoDir),
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
