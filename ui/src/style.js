export const _var = name => `var(--${name})`,
  // sizes
  gap1 = _var('gap1'),
  gap2 = _var('gap2'),
  radius1 = _var('radius1'),
  radius2 = _var('radius2'),
  width1 = _var('width1'),
  width2 = _var('width2'),
  // colors
  mono0 = _var('mono0'),
  mono1 = _var('mono1'),
  mono2 = _var('mono2'),
  mono3 = _var('mono3'),
  mono4 = _var('mono4'),
  mono5 = _var('mono5'),
  mono6 = _var('mono6'),
  mono7 = _var('mono7'),
  mono8 = _var('mono8'),
  mono9 = _var('mono9'),
  // others
  textPadding = _var('text-padding')

export function css(selector, rules) {
  return [
    `${selector} {`,
    ...(Object.entries(rules).map(
      ([key, value]) => `${key}: ${value};`
    )),
    '}'
  ].join('\n')
}

export const cssClass = {
  field: 'field',
  fieldFocusable: 'field--focusable',
  flexRow: 'flex-row',
  message: 'message',
  nickname: 'nickname',
  playerCurrent: 'player--current',
  row: 'row',
  title: 'title',
}

export const cssRule = {
  flexColumn: tagName => css(tagName, {
    display: 'flex',
    'flex-direction': 'column',
    gap: gap2,
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
    'border-color': mono6,
    'border-width': width2,
    'line-height': '1.5',
    outline: 'none',
    background: mono8,
    'border-radius': radius1,
    padding: textPadding,
    color: mono1,
  }),

  css('input:focus, button:focus, select:focus', {
    background: mono9,
    color: mono0,
    'border-color': mono2,
  }),

  css('input:disabled, button:disabled, select:disabled', {
    background: mono7,
    color: mono3,
  }),

  css('button', {
    'min-height': '29.5px',
    'user-select': 'none',
  }),

  css('input', {
    'text-overflow': 'ellipsis',
  }),

  css('input::placeholder', {
    color: mono4,
  }),

  css('select', {
    appearance: 'none',
  }),

  css('form', {
    display: 'flex',
    'flex-direction': 'column',
    overflow: 'hidden',
    gap: gap1
  }),

  css('label', {
    padding: textPadding,
    'user-select': 'none',
  }),

  css('label:after', {
    content: '":"',
  }),

  css(`.${cssClass.field}`, {
    background: mono6,
    width: 'fit-content',
    'border-radius': radius1,
  }),

  css(`.${cssClass.fieldFocusable}:focus-within`, {
    background: mono3,
    color: mono8,
  }),

  css(`.${cssClass.flexRow}`, {
    display: 'flex',
    'flex-direction': 'row',
    gap: gap1,
    'align-items': 'center',
  }),

  css(`.${cssClass.message}`, {
    padding: textPadding,
  }),

  css(`.${cssClass.title}`, {
    'font-size': '1.2em',
    padding: textPadding,
  }),
]
