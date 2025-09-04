export function h(tagName, attributes = null, ...children) {
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
