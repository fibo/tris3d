import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const rootDir = fileURLToPath(dirname(dirname(dirname(import.meta.url))))

const packageJson = await readFile(join(rootDir, 'package.json'), 'utf-8').then(JSON.parse)

export const workspaces = packageJson.workspaces
