import '@tris3d/canvas'
import { h } from './h.js'

class Tris3dPlayground extends HTMLElement {
  canvas = h('tris3d-canvas')
  multiplayer = h('multi-player')

  connectedCallback() {
    this.setStyle()

    const { canvas, multiplayer } = this

    canvas.setAttribute('fps', 30)
    canvas.setAttribute('size', this.canvasSize)
    this.appendChild(canvas)

    this.appendChild(multiplayer)

    multiplayer.connectButton.addEventListener('click', this)
    window.addEventListener('resize', this)
  }

  handleEvent(event) {
    if (event.type === 'click' && event.target === this.multiplayer.connectButton) {
      this.connect()
    }
    if (event.type === 'resize') {
      this.canvas.setAttribute('size', this.canvasSize)
    }
  }

  get canvasSize() {
    const { parentElement } = this
    const { paddingLeft, paddingRight } = getComputedStyle(parentElement)
    return Math.min(
    // The availableWidth is the width of parent excluding its padding.
      parentElement.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight),
      // max size
      500)
  }

  setStyle() {
    this.style.display = 'flex'
    this.style.flexDirection = 'column'
    this.style.gap = '1em'
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

const tagName = 'tris3d-playground'
customElements.get(tagName) || customElements.define(tagName, Tris3dPlayground)
