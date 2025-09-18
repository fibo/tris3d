// Actually it depends on @tris3d/canvas
// but import is omitted.
import { publish, subscribe } from '@tris3d/state'
import { define, h } from '../dom.js'
import { css, cssRule, styleSheet } from '../style.js'

const tagName = 'game-playground'
const canvasTagName = 'tris3d-canvas'

styleSheet(
  cssRule.flexColumn(tagName),
  css(tagName, {
    'min-height': '100vh',
    'padding-block': 'var(--gap)',
  }),
  css(`${tagName} > ${canvasTagName}`, {
    display: 'inline-block',
    'border-style': 'solid',
    'border-width': 'var(--border-width)',
    'border-color': 'var(--border-color)',
    'border-radius': 'var(--border-radius-large)',
  }),
)

class Component extends HTMLElement {
  subscriptions = []

  canvas = h(canvasTagName)
  clientInfo = h('client-info')
  playmodeSwitch = h('playmode-switch')
  localinfo = h('local-info')
  onlineinfo = h('online-info')

  sheet = {
    canvas: new CSSStyleSheet(),
    width: new CSSStyleSheet(),
  }

  get width() {
    const { parentElement } = this
    const { paddingLeft, paddingRight } = getComputedStyle(parentElement)
    return Math.min(
    // The availableWidth is the width of parent excluding its padding.
      parentElement.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight),
      // max size
      500)
  }

  connectedCallback() {
    const { canvas } = this

    canvas.setAttribute('fps', 30)

    document.adoptedStyleSheets.push(...Object.values(this.sheet))

    this.resize()

    this.subscriptions.push(
      subscribe('moves', (moves) => {
        if (moves)
          canvas.setAttribute('moves', moves.join(''))
        else
          canvas.removeAttribute('moves')
      }),

      subscribe('playing', (playing, get) => {
        if (playing) {
          const playmode = get('playmode')
          if (playmode === 'local') {
            const players = get('local-players')
            const player = players.indexOf('human')
            canvas.setAttribute('player', player)
          }
          canvas.setAttribute('moves', '')
          canvas.addEventListener('move', this)
        } else {
          canvas.removeAttribute('moves')
          canvas.removeAttribute('player')
          canvas.removeEventListener('move', this)
        }
      }),
    )

    this.append(
      canvas,
      this.clientInfo,
      this.playmodeSwitch,
      this.localinfo,
      this.onlineinfo,
    )

    window.addEventListener('resize', this)
  }

  disconnectedCallback() {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      sheet => !Object.values(this.sheet).includes(sheet)
    )
    this.subscriptions.forEach(unsubscribe => unsubscribe())
    window.removeEventListener('resize', this)
  }

  handleEvent(event) {
    if (event.type === 'move') {
      const { position } = event.detail
      publish('moves', (moves) => {
        if (!Array.isArray(moves)) return
        return [...moves, position]
      })
    }
    if (event.type === 'resize') {
      this.resize()
    }
  }

  resize() {
    const { width } = this
    this.sheet.canvas.replaceSync(
      css(canvasTagName, {
        height: `${width}px`,
        width: `${width}px`
      })
    )
    this.sheet.width.replaceSync(
      css(tagName, { width: `${width}px` })
    )
    this.canvas.setAttribute('size', width)
  }

  connect() {
    const url = this.getAttribute('websocket')
    if (!url) return
    const socket = new WebSocket(url)
    socket.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data)
        console.info('message', type, data)
      } catch (error) {
        console.error(error)
      }
    }
    socket.onopen = (event) => {
      console.info('open', event)
    }
  }
}

define(tagName, Component)
