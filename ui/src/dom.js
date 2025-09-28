import { cssClass, cssVarName } from './style.js'

export const aria = {
  disabled: 'aria-disabled',
}

const dataAttribute = {
  playerId: 'data-playerid',
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

export const domComponent = {
  color: (playerId) => {
    const element = h('span', {
      class: cssClass.color,
      [dataAttribute.playerId]: playerId,
    })
    return Object.assign(element, {
      disable: () => {
        element.setAttribute(aria.disabled, 'true')
      },
      enable: () => {
        element.removeAttribute(aria.disabled)
      },
      get isDisabled() {
        return element.getAttribute(aria.disabled) === 'true'
      },
      get playerId() {
        return element.getAttribute(dataAttribute.playerId)
      },
      setColor: (color) => {
        element.style.setProperty(cssVarName.color, color)
      },
    })
  },

  icon: () => h('span', { class: cssClass.icon }),

  field: (label, element) => h('div', {
    class: `${cssClass.field} ${cssClass.fieldFocusable}`,
  }, [
    h('label', { for: element.id }, [label]),
    element
  ]),

  input: (attributes) => {
    const element = h('input', attributes)
    return Object.assign(element, {
      disable: () => {
        element.classList.add(cssClass.disabled)
        element.setAttribute('tabindex', '-1')
        element.setAttribute('readonly', 'true')
      },
      enable: () => {
        element.removeAttribute('tabindex')
        element.removeAttribute('readonly')
        element.classList.remove(cssClass.disabled)
      },
    })
  },

  message: (text = '') => h('div', { class: cssClass.message }, [text]),

  select: (attributes, options) => {
    const element = h('select', attributes, options.map(
      ({ value, label }) => h('option', { value }, [label])
    ))
    return Object.assign(element, {
      disable: () => {
        element.classList.add(cssClass.disabled)
        element.setAttribute('tabindex', '-1')
      },
      enable: () => {
        element.removeAttribute('tabindex')
        element.classList.remove(cssClass.disabled)
      },
    })
  },

  title: text => h('div', { class: cssClass.title }, [text]),
}

export function show(element) {
  element.removeAttribute('hidden')
}

export function hide(element) {
  element.setAttribute('hidden', 'true')
}
