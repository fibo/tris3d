import { exec } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import os from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { context } from 'esbuild'

async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

async function startServer({ demoDir, port }) {
  const outDir = join(demoDir, 'out')
  const srcDir = join(demoDir, 'src')

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

await startServer({
  demoDir: fileURLToPath(dirname(import.meta.url)),
  port,
})

openBrowser({ port })
