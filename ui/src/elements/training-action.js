import { StateController, i18n } from '@tris3d/client'
import { define, h } from '../dom.js'
import { showIfPlaymode } from '../state.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'training-action'

styleSheet(
  cssRule.hidable(tagName),
  cssRule.flexColumn(tagName),
)

class Component extends HTMLElement {
  state = new StateController()

  button = h('button')

  connectedCallback() {
    this.state
      .on_action((action) => {
        this.button.textContent = i18n.translate(`action.${action}`)
      })
      .on_playmode(showIfPlaymode('training', this))

    this.button.addEventListener('click', this)

    this.append(
      this.button,
    )
  }

  disconnectedCallback() {
    this.button.removeEventListener('click', this)
    this.state.dispose()
  }

  handleEvent(event) {
    if (event.type === 'click') {
      this.state.togglePlaying()
    }
  }
}

define(tagName, Component)
