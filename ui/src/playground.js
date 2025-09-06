// Actually it depends on @tris3d/canvas
// but import is omitted.
import { css, define, h, styles } from './utils.js'

const tagName = 'tris3d-playground'

styles(
  css(tagName, {
    display: 'flex',
    'flex-direction': 'column',
    gap: 'var(--gap)',
    'min-height': '100vh',
    'padding-block': 'var(--gap)',
  })
)

class Component extends HTMLElement {
  clientsettings = h('client-settings')
  canvas = h('tris3d-canvas')
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

    this.append(
      this.clientsettings,
      canvas,
      this.localinfo,
      this.onlineinfo,
    )

    window.addEventListener('resize', this)
  }

  handleEvent(event) {
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
