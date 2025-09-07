import { publish, subscribe } from '@tris3d/game'
import { cssRule, define, field, h, styles } from './utils.js'

const tagName = 'player-info'

styles(
  cssRule.hidable(tagName),
)

class Component extends HTMLElement {
  subscriptions = []

  nicknameInput = h('input', {
    id: 'nickname', name: 'nickname', type: 'text',
    value: localStorage.getItem('nickname') || '',
  })

  form = h('form', {}, [
    field('nick name', this.nicknameInput)
  ])

  connectedCallback() {
    const { form, nicknameInput } = this

    publish('nickname', nicknameInput.value)

    form.addEventListener('submit', this)
    nicknameInput.addEventListener('blur', this)

    this.subscriptions.push(
      subscribe('editing-client-settings', (editing) => {
        if (editing) this.show()
        else this.hide()
      }),

      subscribe('playing', (playing) => {
        if (playing) {
          this.nicknameInput.disabled = true
        } else {
          this.nicknameInput.disabled = false
        }
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
    localStorage.setItem('nickname', nickname)
    publish('nickname', nickname)
  }

  show() { this.removeAttribute('hidden') }
  hide() { this.setAttribute('hidden', 'true') }
}

define(tagName, Component)
