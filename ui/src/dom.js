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

export const domComponent = {
  field: (label, element, classlist = []) => h('div', {
    class: ['field', 'field--focusable', ...classlist].join(' '),
  }, [
    h('label', { for: element.id }, [label]),
    element
  ]),
  message: (text = '') => h('div', { class: 'message' }, [text]),
  title: text => h('div', { class: 'title' }, [text]),
}

export function show(element) {
  element.removeAttribute('hidden')
}

export function hide(element) {
  element.setAttribute('hidden', 'true')
}
