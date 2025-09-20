import { StateController, i18n } from '@tris3d/client'
import { define, domComponent } from '../dom.js'

const tagName = 'room-list'

class Component extends HTMLElement {
  state = new StateController()

  connectedCallback() {
    const title = domComponent.title(i18n.translate('rooms'))

    this.append(
      title
    )
  }

  disconnectedCallback() {
    this.state.dispose()
  }
}

define(tagName, Component)
