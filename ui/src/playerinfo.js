import { publish } from '@tris3d/game'

import { css } from './css.js'
import { h } from './h.js'

const tagName = 'player-info'

css(
  `${tagName} form {
      display: flex;
  }`,
  `${tagName} form .field {
    display: flex;
    gap: 1em;
  }`
)

class Playerinfo extends HTMLElement {
  subscriptions = []

  nicknameInput = h('input', {
    id: 'nickname', name: 'nickname', type: 'text',
    value: localStorage.getItem('nickname') || '',
  })

  form = h('form', {}, [
    h('div', { class: 'field' }, [
      h('label', { for: 'nickname' }, 'nickname'),
      this.nicknameInput
    ])
  ])

  connectedCallback() {
    const { form, nicknameInput } = this

    publish('nickname', nicknameInput.value)

    form.addEventListener('submit', this)
    nicknameInput.addEventListener('blur', this)

    this.append(form)
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this)
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
    if (nickname) {
      localStorage.setItem('nickname', nickname)
      publish('nickname', nickname)
    }
  }
}

customElements.get(tagName) || customElements.define(tagName, Playerinfo)
