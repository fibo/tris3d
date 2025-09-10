// Actually it depends on @tris3d/canvas
// but import is omitted.
import { peek, publish, subscribe } from '@tris3d/game'
import { css, define, h, styles } from '../utils.js'

const tagName = 'game-playground'
const canvasTagName = 'tris3d-canvas'

styles(
  css(tagName, {
    display: 'flex',
    'flex-direction': 'column',
    gap: 'var(--gap)',
    'min-height': '100vh',
    'padding-block': 'var(--gap)',
  }),
  css(canvasTagName, {
    display: 'inline-block',
    'border-style': 'solid',
    'border-width': 'var(--border-width)',
    'border-color': 'var(--border-color)',
    'border-radius': 'var(--border-radius-large)',
  }),
)

class Component extends HTMLElement {
  static observedAttributes = ['debug']

  subscriptions = []

  clientsettings = h('client-settings')
  canvas = h(canvasTagName)
  localinfo = h('local-info')
  onlineinfo = h('online-info')

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

    this.resize()

    this.subscriptions.push(
      subscribe('moves', (moves) => {
        if (moves)
          canvas.setAttribute('moves', moves.join(''))
        else
          canvas.removeAttribute('moves')
      }),

      subscribe('playing', (playing) => {
        if (playing) {
          const playmode = peek('playmode')
          if (playmode === 'local') {
            const players = peek('local-players')
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
      this.clientsettings,
      canvas,
      this.localinfo,
      this.onlineinfo,
    )

    window.addEventListener('resize', this)
  }

  disconnectedCallback() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
    window.removeEventListener('resize', this)
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'debug') {
      const debug = newValue !== null
      this.debug = debug
      publish('debug', debug)
    }
  }

  handleEvent(event) {
    if (event.type === 'move') {
      const { position } = event.detail
      publish('moves', (moves) => {
        if (moves === undefined) return
        return [...moves, position]
      })
    }
    if (event.type === 'resize') {
      this.resize()
    }
  }

  resize() {
    const width = this.width
    this.style.width = `${width}px`
    this.canvas.setAttribute('size', width)
  }

  connect() {
    const url = this.getAttribute('websocket')
    if (!url) return
    const socket = new WebSocket(url)
    socket.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data)
        if (this.debug) console.info('message', type, data)
      } catch (error) {
        console.error(error)
      }
    }
    socket.onopen = (event) => {
      if (this.debug) console.info('open', event)
    }
  }
}

define(tagName, Component)
