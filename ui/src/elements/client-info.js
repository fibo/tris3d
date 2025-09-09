import { publish, subscribe } from '@tris3d/game'
import { getStoredNickname } from '../webStorage.js'
import { cssRule, define, domComponent, h, styles, hide, show } from '../utils.js'
import { nicknameLabel } from '../i18n.js'

const tagName = 'client-info'

styles(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  subscriptions = []

  nicknameInput = h('input', {
    id: 'nickname', name: 'nickname', type: 'text',
    value: getStoredNickname(),
  })

  form = h('form', {}, [
    domComponent.field(nicknameLabel, this.nicknameInput)
  ])

  connectedCallback() {
    const { form, nicknameInput } = this

    publish('nickname', nicknameInput.value)

    form.addEventListener('submit', this)
    nicknameInput.addEventListener('blur', this)

    this.subscriptions.push(
      subscribe('editing-client-settings', (editing) => {
        if (editing) show(this)
        else hide(this)
      }),

      subscribe('playing', (playing) => {
        if (playing) this.nicknameInput.disabled = true
        else this.nicknameInput.disabled = false
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
      this.setNickname(event.target.value)
    }

    if (event.type === 'submit') {
      event.preventDefault()
      this.nicknameInput.blur()
    }
  }

  setNickname(value) {
    const nickname = value.trim()
    publish('nickname', nickname)
  }
}

define(tagName, Component)
