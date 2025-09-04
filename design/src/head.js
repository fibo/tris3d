import { themeColor } from './theme.js'
import { baseCss } from './styles.js'

export const baseStyle = `<style>${baseCss}</style>`

export const emptyFavicon = '<link rel="icon" href="data:image/x-icon;base64,AA">'

export const metaThemeColor = `<meta name="theme-color" content="${themeColor}">`

export const metaViewport = '<meta name="viewport" content="width=device-width, interactive-widget=resizes-content">'
