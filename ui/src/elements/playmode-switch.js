import { publish, subscribe } from '@tris3d/game'
import { define, domComponent, h } from '../dom.js'
import { playModeLabel } from '../i18n.js'

const tagName = 'playmode-switch'

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
      subscribe('playing', (playing) => {
        this.select.disabled = !!playing
      }),
    )

    this.append(domComponent.field(playModeLabel, select))
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
}

define(tagName, Component)
