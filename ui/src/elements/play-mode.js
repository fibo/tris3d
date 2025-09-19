import { publish, subscribe } from '@tris3d/state'
import { playModeLabel } from '@tris3d/i18n'
import { define, domComponent, h } from '../dom.js'

const tagName = 'play-mode'

class Component extends HTMLElement {
  subscriptions = []

  select = h('select', { id: 'playmode', disabled: true }, [
    h('option', { value: 'local' }, 'training'),
    h('option', { value: 'online', disabled: true }, 'online'),
  ])

  connectedCallback() {
    const { select } = this

    select.addEventListener('change', this)

    publish('playmode', 'local')

    this.subscriptions.push(
      subscribe('playing', (playing) => {
        if (playing !== undefined)
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
