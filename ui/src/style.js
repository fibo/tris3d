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
    gap: 'var(--gap2)',
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
    'border-color': 'var(--mono6)',
    'border-width': 'var(--width2)',
    'line-height': '1.5',
    outline: 'none',
    background: 'var(--mono8)',
    'border-radius': 'var(--radius1)',
    padding: 'var(--text-padding)',
    color: 'var(--mono1)',
    'user-select': 'none',
  }),

  css('input:focus, button:focus, select:focus', {
    background: 'var(--mono9)',
    color: 'var(--mono0)',
    'border-color': 'var(--mono3)',
  }),

  css('input:disabled, button:disabled, select:disabled', {
    background: 'var(--mono7)',
    color: 'var(--mono3)',
  }),

  css('button', {
    'min-height': '29.5px',
  }),

  css('input', {
    'text-overflow': 'ellipsis',
  }),

  css('input::placeholder', {
    color: 'var(--mono4)',
  }),

  css('select', {
    appearance: 'none',
  }),

  css('form', {
    display: 'flex',
    'flex-direction': 'column',
    overflow: 'hidden',
    gap: 'var(--gap1)'
  }),

  css('label', {
    padding: 'var(--text-padding)',
  }),

  css('label:after', {
    content: '":"',
  }),

  css('.field', {
    width: 'fit-content',
    'border-radius': 'var(--radius1)',
  }),

  css('.field--focusable:focus-within', {
    background: 'var(--mono3)',
    color: 'var(--mono8)',
  }),

  css('.message', {
    padding: 'var(--text-padding)',
  }),

  css('.title', {
    padding: 'var(--text-padding)',
  }),
]
