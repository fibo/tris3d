export function css(style) {
  const sheet = new CSSStyleSheet()
  sheet.insertRule(
    // Minify statements.
    style
      .replace(/\n\s+/g, '')
      .replace(/\n/g, '')
      .trim()
  )
  document.adoptedStyleSheets.push(sheet)
}
