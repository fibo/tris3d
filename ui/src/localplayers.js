import { h } from './h.js'

class Localplayers extends HTMLElement {
  title = h('span', null, 'players')

  connectedCallback() {
    this.append(
      this.title
    )
  }
}

const tagName = 'local-players'
customElements.get(tagName) || customElements.define(tagName, Localplayers)
