import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { workspaceDir } from '@tris3d/repo'
import { renderTemplate } from './templating.js'

async function template(filename) {
  const content = await readFile(join(workspaceDir.screens, 'src', filename), 'utf8')
  return renderTemplate(content)
}

export const baseCss = await template('base.css')

export const landingCss = await template('landing.css')

export const landingHtml = await template('landing.html')

export const pageNotFoundHtml = await template('pageNotFound.html')
