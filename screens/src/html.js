import { baseStyle, landingStyle, emptyFavicon, metaCharset, metaThemeColor, metaViewport } from './head.js'
import { landingHtml, pageNotFoundHtml } from './files.js'
import { renderTemplate } from './templating.js'

export function html(template, variables = {}) {
  return renderTemplate(`
    <!doctype html>
    <html lang="en">
      ${template}
    </html>
  `, {
    baseStyle,
    emptyFavicon,
    landingStyle,
    landingHtml,
    metaCharset,
    metaThemeColor,
    metaViewport,
    pageNotFoundHtml,
    ...variables
  })
}
