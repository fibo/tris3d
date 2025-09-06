import { publish, subscribe } from '@tris3d/game'
import { define, field, h } from './utils.js'

const tagName = 'playmode-switch'

class Component extends HTMLElement {
  subscriptions = []

  select = h('select', { name: 'playmode' }, [
    h('option', { value: 'local' }, 'training'),
    h('option', { value: 'online', disabled: true }, 'online'),
  ])

  connectedCallback() {
    const { select } = this

    select.addEventListener('change', this)

    this.setPlaymode('local')

    this.subscriptions.push(
      subscribe('nickname', (nickname) => {
        for (const option of this.select.options)
          if (option.value === 'online') {
            // TODO
            // if (nickname) option.disabled = false
            // else option.disabled = true
          }
      }),
    )

    this.append(field('playmode', 'play mode', select))
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this)

    this.subscriptions.forEach(unsubscribe => unsubscribe())
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

define(tagName, Component)
