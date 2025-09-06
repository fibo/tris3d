export function css(selector, rules) {
  return `${selector} {\n${Object.entries(rules).map(([key, value]) => `${key}: ${value};`).join('\n')}\n}`
}

export function styles(...rules) {
  const sheet = new CSSStyleSheet()
  for (const rule of rules)
    sheet.insertRule(rule)
  document.adoptedStyleSheets.push(sheet)
}

export function define(tagName, elementClass) {
  customElements.get(tagName) || customElements.define(tagName, elementClass)
}

export function h(tagName, attributes = null, children = []) {
  // Create the element with the given tag name.
  const element = document.createElement(tagName)

  // Set attributes on the element.
  if (attributes)
    for (const [key, value] of Object.entries(attributes))
      element.setAttribute(key, value)

  // Create and append children.
  for (const child of children)
    element.appendChild(
      (typeof child === 'string' || typeof child === 'number')
        ? document.createTextNode(child)
        : child
    )

  // Return the created element.
  return element
}

export function field(key, label, select) {
  return h('div', { class: 'field' }, [
    h('label', { for: key }, label),
    select
  ])
}
