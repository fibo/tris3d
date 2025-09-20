export function css(selector, rules) {
  return [
    `${selector} {`,
    ...(Object.entries(rules).map(
      ([key, value]) => `${key}: ${value};`
    )),
    '}'
  ].join('\n')
}

export const cssRule = {
  flexColumn: tagName => css(tagName, {
    display: 'flex',
    'flex-direction': 'column',
    gap: 'var(--gap)',
  }),
  hidable: tagName => css(`${tagName}[hidden]`, {
    display: 'none',
  }),
}

export function styleSheet(...rules) {
  const sheet = new CSSStyleSheet()
  for (const rule of rules)
    sheet.insertRule(rule)
  document.adoptedStyleSheets.push(sheet)
}

export const mainCssRules = [
  css('input, button, select', {
    font: 'inherit',
    'border-style': 'solid',
    'border-color': 'var(--color-mono-9)',
    'border-width': 'var(--border-width)',
    'line-height': '1.5',
    outline: 'none',
    'background-color': 'var(--color-mono-9)',
    'border-radius': 'var(--border-radius-small)',
    padding: 'var(--text-padding)',
    color: 'var(--text-color)',
  }),

  css('input:focus, button:focus, select:focus', {
    'background-color': 'var(--color-mono-9)',
    color: 'var(--text-color)',
    'border-color': 'var(--border-color)',
  }),

  css('input:disabled, button:disabled, select:disabled', {
    'background-color': 'var(--color-mono-8)',
    'border-color': 'var(--color-mono-5)',
  }),

  css('button', {
    'min-height': '29.5px',
  }),

  css('input', {
    'text-overflow': 'ellipsis',
  }),

  css('select', {
    appearance: 'none',
  }),

  css('form', {
    display: 'flex',
    'flex-direction': 'column',
    overflow: 'hidden',
    gap: 'var(--gap-small)'
  }),

  css('label', {
    padding: 'var(--text-padding)',
  }),

  css('label:after', {
    content: '":"',
  }),

  css('.field', {
    width: 'fit-content',
    'background-color': 'var(--color-mono-8)',
    'border-width': 'var(--border-width)',
    'border-radius': 'var(--border-radius-small)',
    padding: 'var(--gap-small)',
  }),

  css('.message', {
    padding: 'var(--text-padding)',
  }),

  css('.message', {
    padding: 'var(--text-padding)',
  }),

  css('.title', {
    padding: 'var(--text-padding)',
  }),
]
