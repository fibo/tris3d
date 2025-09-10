import { publish, subscribe } from '@tris3d/game'
import { cssRule, define, domComponent, h, styles, hide, show } from '../utils.js'
import { nicknameLabel } from '../i18n.js'

const tagName = 'client-info'

styles(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  subscriptions = []

  nickname = h('input', { type: 'text', maxlength: 256 })

  form = h('form', {}, [
    domComponent.field(nicknameLabel, this.nickname)
  ])

  connectedCallback() {
    const { form, nickname } = this

    form.addEventListener('submit', this)
    nickname.addEventListener('blur', this)

    this.subscriptions.push(
      subscribe('editing-client-settings', (editing) => {
        if (editing) show(this)
        else hide(this)
      }),

      subscribe('nickname', (value) => {
        if (value)
          nickname.value = value
      }),

      subscribe('playing', (playing) => {
        if (playing) this.nickname.disabled = true
        else this.nickname.disabled = false
      }),
    )

    this.append(form)
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this)
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }

  handleEvent(event) {
    if (event.type === 'blur') {
      event.preventDefault()
      const nickname = event.target.value.trim()
      publish('nickname', nickname)
    }

    if (event.type === 'submit') {
      event.preventDefault()
      this.nickname.blur()
    }
  }
}

define(tagName, Component)
