// Actually it depends on @tris3d/canvas
// but import is omitted.
import { computeMaxWidth, css, define, h, styles } from './utils.js'

const tagName = 'tris3d-playground'

styles(
  css(tagName, {
    display: 'flex',
    'flex-direction': 'column',
    gap: 'var(--gap)',
    'margin-bottom': 'var(--gap)',
  })
)

class Component extends HTMLElement {
  canvas = h('tris3d-canvas')
  localinfo = h('local-info')
  onlineinfo = h('online-info')

  get maxWidth() {
    return computeMaxWidth(this.parentElement)
  }

  connectedCallback() {
    const { canvas } = this

    canvas.setAttribute('fps', 30)
    canvas.setAttribute('size', this.maxWidth)

    this.append(
      canvas,
      this.localinfo,
      this.onlineinfo,
    )

    window.addEventListener('resize', this)
  }

  handleEvent(event) {
    if (event.type === 'resize') {
      this.canvas.setAttribute('size', this.maxWidth)
    }
  }

  connect() {
    const debug = this.getAttribute('debug')
    const url = this.getAttribute('websocket')
    if (!url) return
    const socket = new WebSocket(url)
    socket.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data)
        if (debug) console.info('message', type, data)
      } catch (error) {
        console.error(error)
      }
    }
    socket.onopen = (event) => {
      if (debug) console.info('open', event)
    }
  }
}

define(tagName, Component)
