import { mkdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { workspaces } from './package.js'

export const rootDir = fileURLToPath(dirname(dirname(dirname(import.meta.url))))

export const workspaceDir = workspaces.reduce((rest, workspace) => ({
  [workspace]: join(rootDir, workspace),
  ...rest,
}), {})

export async function resetDir(dir) {
  try {
    await rm(dir, { recursive: true, force: true })
    await mkdir(dir, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}
