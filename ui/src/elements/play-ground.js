// Actually it depends on @tris3d/canvas
// but import is omitted.
import { StateController } from '@tris3d/client'
import { define, h } from '../dom.js'
import { css, cssRule, styleSheet } from '../style.js'

const tagName = 'play-ground'
const canvasTagName = 'tris3d-canvas'

styleSheet(
  cssRule.flexColumn(tagName),
  css(tagName, {
    'min-height': '100vh',
    'padding-block': 'var(--gap2)',
  }),
  css(`${tagName} > ${canvasTagName}`, {
    display: 'inline-block',
    'border-style': 'solid',
    'border-width': 'var(--width1)',
    'border-color': 'var(--mono5)',
    'border-radius': 'var(--radius2)',
  }),
  css(`${tagName} .actions`, {
    display: 'flex',
    gap: 'var(--gap2)',
    'justify-content': 'space-between',
  }),
)

class Component extends HTMLElement {
  state = new StateController()
  subscriptions = []

  canvas = h(canvasTagName, { readonly: true })

  multiplayerAction = h('multiplayer-action', {}, '')
  trainingAction = h('training-action', {}, '')
  nickName = h('nick-name')
  playMode = h('play-mode')
  localInfo = h('local-info')
  onlineInfo = h('online-info')

  sheet = {
    width: new CSSStyleSheet(),
  }

  get width() {
    const { parentElement } = this
    const { paddingLeft, paddingRight } = getComputedStyle(parentElement)
    return Math.max(Math.min(
      // The available width is the width of parent excluding its padding.
      parentElement.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight),
      500), // max size
    300) // min size
  }

  connectedCallback() {
    const { canvas } = this

    canvas.setAttribute('fps', 30)

    document.adoptedStyleSheets.push(...Object.values(this.sheet))

    this.resize()

    this.state
      .on_game_over((gameOver) => {
        if (gameOver) {
          canvas.setAttribute('readonly', 'true')
        }
      })
      .on_moves((moves) => {
        if (moves)
          canvas.setAttribute('moves', moves.join(''))
        else
          canvas.removeAttribute('moves')
      })
      .on_next_training_ai_move((position) => {
        setTimeout(() => {
          this.state.addMove(position)
        }, 1000 + Math.random() * 2000)
      })
      .on_playing((playing) => {
        if (playing) {
          canvas.setAttribute('moves', '')
          canvas.removeAttribute('winner')
          canvas.addEventListener('move', this)
        } else {
          canvas.removeAttribute('moves')
          canvas.removeEventListener('move', this)
        }
      })
      .on_winner((winner) => {
        canvas.setAttribute('winner', winner.index)
      })
      .on_your_turn((yourTurn) => {
        if (yourTurn)
          canvas.removeAttribute('readonly')
        else
          canvas.setAttribute('readonly', 'true')
      })

    window.addEventListener('resize', this)

    this.append(
      canvas,
      h('div', { class: 'actions' }, [
        this.playMode,
        this.trainingAction,
        this.multiplayerAction,
      ]),
      this.nickName,
      this.localInfo,
      this.onlineInfo,
    )
  }

  disconnectedCallback() {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      sheet => !Object.values(this.sheet).includes(sheet)
    )
    this.state.dispose()
    window.removeEventListener('resize', this)
  }

  handleEvent(event) {
    if (event.type === 'move') {
      this.state.addMove(event.detail.position)
    }
    if (event.type === 'resize') {
      this.resize()
    }
  }

  resize() {
    const { width } = this
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
