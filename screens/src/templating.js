import { appName, appDescription, themeColor } from '@tris3d/design'

export function renderTemplate(template, variables = {}) {
  let content = template
  for (const [key, value] of Object.entries({
    appName,
    appDescription,
    themeColor,
    ...variables,
  }))
    content = content.replaceAll(`{${key}}`, value)
  return content
}
