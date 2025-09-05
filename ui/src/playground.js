import '@tris3d/canvas'
import { css } from './css.js'
import { h } from './h.js'

const tagName = 'tris3d-playground'

css(`
  ${tagName} {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
`)

class Tris3dPlayground extends HTMLElement {
  static observedAttributes = [
    'playmode',
  ]

  canvas = h('tris3d-canvas')
  localInfo = h('local-info')
  onlineInfo = h('online-info')

  connectedCallback() {
    const { canvas } = this

    canvas.setAttribute('fps', 30)
    canvas.setAttribute('size', this.canvasSize)

    this.append(
      canvas,
      this.localInfo,
      this.onlineInfo,
    )

    window.addEventListener('resize', this)
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'playmode') {
      if (newValue === 'local') {
      }

      if (newValue === 'online') {
      }
    }
  }

  handleEvent(event) {
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

customElements.get(tagName) || customElements.define(tagName, Tris3dPlayground)
