import { css, define, h, styles, svg } from './utils.js'

const tagName = 'client-settings'
const iconHeight = 24

styles(
  css(tagName, {
    display: 'flex',
    'flex-direction': 'column',
    gap: 'var(--gap)',
    'margin-block': 'var(--gap)',
    overflow: 'hidden',
    'padding-bottom': 'var(--gap)',
  }),

  css(`${tagName}.closed`, {
    height: `${iconHeight + 2}px`,
  }),

  css(`${tagName} .top`, {
    display: 'flex',
  }),

  css(`${tagName} .top svg`, {
    fill: 'var(--text-color)',
  })
)

class Component extends HTMLElement {
  playerinfo = h('player-info')
  playmodeswitch = h('playmode-switch')
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

    this.append(
      top,
      this.playmodeswitch,
      this.playerinfo,
    )

    top.addEventListener('click', this)
    window.addEventListener('click', this)
  }

  disconnectedCallback() {
    this.top.removeEventListener('click', this)
  }

  handleEvent(event) {
    if (event.type === 'click') {
      if (event.currentTarget === this.top) {
        this.classList.toggle('closed')
      }
      // Close when clicking outside.
      if (event.target !== this && !this.contains(event.target)) {
        this.classList.add('closed')
      }
    }
  }
}

define(tagName, Component)
