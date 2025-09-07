import { publish, subscribe } from '@tris3d/game'
import { cssRule, define, field, h, styles } from './utils.js'

const tagName = 'playmode-switch'

styles(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  subscriptions = []

  select = h('select', { id: 'playmode', name: 'playmode' }, [
    h('option', { value: 'local' }, 'training'),
    h('option', { value: 'online', disabled: true }, 'online'),
  ])

  connectedCallback() {
    const { select } = this

    select.addEventListener('change', this)

    publish('playmode', 'local')

    this.subscriptions.push(
      subscribe('editing-client-settings', (editing) => {
        if (editing) this.show()
        else this.hide()
      }),

      subscribe('nickname', (nickname) => {
        for (const option of this.select.options)
          if (option.value === 'online') {
            if (nickname) option.disabled = false
            else option.disabled = true
          }
      }),

      subscribe('playing', (playing) => {
        if (playing) {
          this.select.disabled = true
        } else {
          this.select.disabled = false
        }
      }),
    )

    this.append(field('play mode', select))
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this)

    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }

  handleEvent(event) {
    if (event.type === 'change') {
      const playmode = event.target.value
      publish('playmode', playmode)
    }
  }

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
