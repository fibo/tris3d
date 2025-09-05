import '@tris3d/canvas'
import { css, define, h } from './utils.js'

const tagName = 'tris3d-playground'

css(
  `${tagName} {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    margin-bottom: var(--gap);
  }`
)

class Component extends HTMLElement {
  canvas = h('tris3d-canvas')
  localinfo = h('local-info')
  onlineinfo = h('online-info')
  playerinfo = h('player-info')
  playmodeswitch = h('playmode-switch')

  connectedCallback() {
    const { canvas } = this

    canvas.setAttribute('fps', 30)
    canvas.setAttribute('size', this.canvasSize)

    this.append(
      canvas,
      this.playerinfo,
      this.localinfo,
      this.onlineinfo,
      this.playmodeswitch,
    )

    window.addEventListener('resize', this)
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

define(tagName, Component)
