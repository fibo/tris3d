import { publish, subscribe } from '@tris3d/game'
import { cssRule, define, domComponent, h, styles } from '../utils.js'
import { nicknameLabel } from '../i18n.js'

const tagName = 'client-info'

styles(
  cssRule.hidable(tagName),
)

const maxlength = 32

class Component extends HTMLElement {
  subscriptions = []

  nickname = h('input', {
    id: 'nickname',
    type: 'text',
    maxlength,
  })

  form = h('form', {}, [
    domComponent.field(nicknameLabel, this.nickname)
  ])

  connectedCallback() {
    const { form, nickname } = this

    form.addEventListener('submit', this)
    nickname.addEventListener('blur', this)

    this.subscriptions.push(
      subscribe('nickname', (value) => {
        if (value)
          nickname.value = value
      }),

      subscribe('playing', (playing) => {
        this.nickname.disabled = !!playing
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
      publish('nickname', nickname.substring(0, maxlength))
    }

    if (event.type === 'submit') {
      event.preventDefault()
      this.nickname.blur()
    }
  }
}

define(tagName, Component)
