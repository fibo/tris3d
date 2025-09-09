import { publish, subscribe } from '@tris3d/game'
import { css, cssRule, define, domComponent, h, styles, svg, show, hide } from '../utils.js'
import { cannotEditWhilePlayingLabel } from '../i18n.js'

const tagName = 'client-settings'
const iconHeight = 24

styles(
  css(tagName, {
    display: 'flex',
    'flex-direction': 'column',
    gap: 'var(--gap)',
    overflow: 'hidden',
    'padding-bottom': 'var(--gap-small)',
  }),

  css(`${tagName}.closed`, {
    height: `${iconHeight + 2}px`,
    'padding-bottom': 0,
  }),

  css(`${tagName} .top`, {
    display: 'flex',
  }),

  css(`${tagName} .top svg`, {
    fill: 'var(--text-color)',
  }),

  cssRule.message(tagName)
)

class Component extends HTMLElement {
  subscriptions = []

  cannotEdit = domComponent.message(cannotEditWhilePlayingLabel)

  clientInfo = h('client-info')
  playmodeSwitch = h('playmode-switch')
  top = h('div', { class: 'top' }, [
    svg('svg', { viewBox: `0 0 ${iconHeight} ${iconHeight}`, width: iconHeight, height: iconHeight },
      [0, 1, 2].map((i) => {
        const r = iconHeight / 6 // radius
        return svg('circle', { cx: iconHeight / 2, cy: r + (i * iconHeight / 3), r })
      })
    )
  ])

  connectedCallback() {
    this.classList.add('closed')

    const { top } = this

    this.subscriptions.push(
      subscribe('editing-client-settings', (editing) => {
        if (editing) this.classList.remove('closed')
        else this.classList.add('closed')
      }),

      subscribe('playing', (playing) => {
        if (playing) show(this.cannotEdit)
        else hide(this.cannotEdit)
      }),
    )

    this.append(
      top,
      this.playmodeSwitch,
      this.clientInfo,
      this.cannotEdit,
    )

    top.addEventListener('click', this)
  }

  disconnectedCallback() {
    this.top.removeEventListener('click', this)
    this.subscriptions.forEach(unsubscribe => unsubscribe())
  }

  handleEvent(event) {
    if (event.type === 'click') {
      if (event.currentTarget === this.top) {
        publish('editing-client-settings', editing => !editing)
        window.addEventListener('click', this)
      }
      // Outside click.
      if (event.target !== this && !this.contains(event.target)) {
        publish('editing-client-settings', false)
        window.removeEventListener('click', this)
      }
    }
  }
}

define(tagName, Component)
