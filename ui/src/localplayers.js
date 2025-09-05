import { css } from './css.js'
import { h } from './h.js'

const tagName = 'local-players'

css(
  `${tagName} form {
    display: none;
  }`
)

class Localplayers extends HTMLElement {
  title = h('span', null, 'players')

  connectedCallback() {
    this.append(
      this.title
    )
  }
}

customElements.get(tagName) || customElements.define(tagName, Localplayers)
