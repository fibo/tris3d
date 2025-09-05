import { h } from './h.js'

const tagName = 'room-list'

class Roomlist extends HTMLElement {
  title = h('span', null, 'rooms')

  connectedCallback() {
    this.append(
      this.title
    )
  }
}

customElements.get(tagName) || customElements.define(tagName, Roomlist)
