import '@tris3d/canvas'
import '@tris3d/ui'
import { GameBoard, POSITIONS } from '@tris3d/game'

let canvas
let socket
const board = new GameBoard()

function connect(event) {
  event.preventDefault()
  const URL = event.target.serverUrl.value
  socket = new WebSocket(URL)
  socket.onmessage = (event) => {
    try {
      const { type, data } = JSON.parse(event.data)
      console.info('message', type, data)

      if (type === 'INIT') {
        const { sessionId } = data
        socket.send(JSON.stringify({ type: 'JOIN_ROOM', data: { clientId: sessionId } }))
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
  socket.onopen = (event) => {
    console.log('open', event)
  }
  setTimeout(() => {
    socket.send(JSON.stringify({ type: 'join', name: 'Player' }))
  }, 3000)
}

function getRandomMove() {
  for (const position of POSITIONS) {
    if (board.moves.indexOf(position) === -1) {
      return position
    }
  }
}

function finishGame() {
  alert('Game over')
}

function nextMove(count) {
  if (count === 0) return
  const move = getRandomMove()
  const success = board.addMove(move)
  if (success) {
    canvas.setAttribute('moves', canvas.getAttribute('moves') + move)
    if (board.gameIsOver) {
      finishGame()
    } else {
      setTimeout(() => {
        nextMove(count - 1)
      }, 1000)
    }
  } else {
    alert('Cannot set move')
  }
}

function onmoveSinglePlayer(event) {
  const { position } = event.detail
  board.addMove(position)
  if (socket) {
    socket.send(JSON.stringify({ type: 'move', position }))
  }
  if (board.gameIsOver) {
    finishGame()
  } else {
    setTimeout(() => {
      nextMove(2)
    }, 1000)
  }
}

function startSinglePlayerGame() {
  canvas.setAttribute('player', 0)
  canvas.setAttribute('moves', '')
  canvas.addEventListener('move', onmoveSinglePlayer)
}

addEventListener('load', () => {
  const playground = document.createElement('tris3d-playground')
  playground.setAttribute('debug', 'true')
  playground.setAttribute('websocket', 'ws://localhost:3456')
  document.body.appendChild(playground)
})
