import { themeColor } from '@tris3d/design'
import { baseCss, landingCss } from './files.js'

export const metaCharset = '<meta charset="utf-8">'

export const baseStyle = `<style>${baseCss}</style>`
export const landingStyle = `<style>${landingCss}</style>`

export const emptyFavicon = '<link rel="icon" href="data:image/x-icon;base64,AA">'

export const metaThemeColor = `<meta name="theme-color" content="${themeColor}">`

export const metaViewport = '<meta name="viewport" content="width=device-width, interactive-widget=resizes-content">'
