import { publish } from '@tris3d/game'
import { define, h } from './utils.js'

const tagName = 'player-info'

class Component extends HTMLElement {
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

define(tagName, Component)
