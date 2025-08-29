import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { workspaceDir } from '@tris3d/repo'
import { themeColor } from './theme.js'

const srcDir = join(workspaceDir.design, 'src')

const baseStyleContent = await readFile(join(srcDir, 'base.css'), 'utf8')

export const baseStyle = baseStyleContent
  .replace('${themeColor}', themeColor)
