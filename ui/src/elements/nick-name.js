import { StateController } from '@tris3d/client'
import { nicknameLabel } from '@tris3d/i18n'
import { define, domComponent, h } from '../dom.js'
import { css, cssRule, styleSheet } from '../style.js'

const tagName = 'nick-name'

styleSheet(
  cssRule.hidable(tagName),

  css('input#nickname', {
    width: '21ch',
  }),
)

const maxlength = 32

class Component extends HTMLElement {
  state = new StateController()
  subscriptions = []

  nickname = h('input', {
    id: 'nickname',
    type: 'text',
    maxlength,
    spellcheck: 'false',
  })

  form = h('form', {}, [
    domComponent.field(nicknameLabel, this.nickname)
  ])

  connectedCallback() {
    const { form, nickname } = this

    form.addEventListener('submit', this)
    nickname.addEventListener('blur', this)

    this.state.on({
      connected: (connected) => {
        if (connected)
          this.nickname.disabled = true
        else
          this.nickname.disabled = false
      },

      nickname: (value) => {
        if (value) nickname.value = value
      },
    })

    this.append(form)
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this)
    this.state.dispose()
  }

  handleEvent(event) {
    if (event.type === 'blur') {
      event.preventDefault()
      const nickname = event.target.value.trim()
      this.state.nickname = nickname.substring(0, maxlength)
    }

    if (event.type === 'submit') {
      event.preventDefault()
      this.nickname.blur()
    }
  }
}

define(tagName, Component)
