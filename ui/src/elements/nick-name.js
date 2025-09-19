import { Client } from '@tris3d/client'
import { nicknameLabel } from '@tris3d/i18n'
import { define, domComponent, h } from '../dom.js'
import { cssRule, styleSheet } from '../style.js'

const tagName = 'nick-name'

styleSheet(
  cssRule.hidable(tagName),
)

const maxlength = 32

class Component extends HTMLElement {
  client = new Client()
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

    this.client.on({
      nickname: (value) => {
        if (value) nickname.value = value
      },

      playing: (playing) => {
        if (playing === undefined) return
        this.nickname.disabled = !!playing
      },
    })

    this.append(form)
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this)
    this.client.dispose()
  }

  handleEvent(event) {
    if (event.type === 'blur') {
      event.preventDefault()
      const nickname = event.target.value.trim()
      this.client.nickname = nickname.substring(0, maxlength)
    }

    if (event.type === 'submit') {
      event.preventDefault()
      this.nickname.blur()
    }
  }
}

define(tagName, Component)
