import { StateController, i18n } from '@tris3d/client'
import { define, domComponent, h } from '../dom.js'
import { css, cssRule, styleSheet } from '../style.js'

const tagName = 'nick-name'

styleSheet(
  cssRule.hidable(tagName),

  css('.nickname', {
    width: '21ch',
  }),
)

const maxlength = 32

class Component extends HTMLElement {
  state = new StateController()
  subscriptions = []

  input = h('input', {
    id: 'nickname',
    class: 'nickname',
    type: 'text',
    maxlength,
    spellcheck: 'false',
  })

  field = domComponent.field(i18n.translate('nick_name'), this.input)

  form = h('form', {}, [this.field])

  connectedCallback() {
    const { form, input } = this

    form.addEventListener('submit', this)
    input.addEventListener('blur', this)

    this.state.on({
      connected: (connected) => {
        if (connected) {
          this.input.setAttribute('readonly', 'true')
          this.feild.classList.remove('field--focusable')
        } else {
          this.input.removeAttribute('readonly')
          this.field.classList.add('field--focusable')
        }
      },

      nickname: (value) => {
        if (value) input.value = value
      },
    })

    this.append(form)
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this)
    this.input.removeEventListener('blur', this)
    this.state.dispose()
  }

  handleEvent(event) {
    if (event.type === 'blur') {
      event.preventDefault()
      const name = event.target.value.trim()
      this.state.nickname = name.substring(0, maxlength)
    }

    if (event.type === 'submit') {
      event.preventDefault()
      this.input.blur()
    }
  }
}

define(tagName, Component)
