export function css(...rules) {
  const sheet = new CSSStyleSheet()
  for (const rule of rules)
    sheet.insertRule(
      // Minify statements.
      rule
        .replace(/\n\s+/g, '')
        .replace(/\n/g, '')
        .trim()
    )
  document.adoptedStyleSheets.push(sheet)
}
