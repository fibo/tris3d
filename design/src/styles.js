import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { workspaceDir } from '@tris3d/repo'
import { themeColor } from './theme.js'

function minified(content) {
  return content
    .replaceAll('\n', '')
}

const srcDir = join(workspaceDir.design, 'src')

const baseCssContent = await readFile(join(srcDir, 'base.css'), 'utf8')

export const baseCss = minified(baseCssContent
  .replace('${themeColor}', themeColor)
)
