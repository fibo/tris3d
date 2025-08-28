import { join } from 'path'
import { workspaceDir } from '@tris3d/repo'

export const outDir = join(workspaceDir.pwa, 'out')

export const filepath = {
  indexHtml: join(outDir, 'index.html'),
}
