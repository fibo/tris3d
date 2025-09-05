import { publish } from '@tris3d/game'

import { h } from './h.js'

const tagName = 'playmode-switch'

class Playmodeswitch extends HTMLElement {
  select = h('select', { name: 'playmode' }, [
    h('option', { value: 'local' }, 'local'),
    h('option', { value: 'online' }, 'online'),
  ])

  connectedCallback() {
    const { select } = this

    select.addEventListener('change', this)

    this.setPlaymode('local')

    this.append(select)
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this)
  }

  handleEvent(event) {
    if (event.type === 'change') {
      this.setPlaymode(event.target.value)
    }
  }

  setPlaymode(value) {
    publish('playmode', value)
  }
}

customElements.get(tagName) || customElements.define(tagName, Playmodeswitch)
