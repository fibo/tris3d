import '@tris3d/canvas'
import { Tris3dBoard, POSITIONS } from '@tris3d/game'

const canvas = document.querySelector('tris3d-canvas')
let board

function connect(event) {
  event.preventDefault()
  const URL = event.target.serverUrl.value
  const socket = new WebSocket(URL)
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    console.log(message)
  }
  socket.onopen = (event) => {
    console.log('open', event)
  }
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
  if (board.gameIsOver) {
    finishGame()
  } else {
    setTimeout(() => {
      nextMove(2)
    }, 1000)
  }
}

function startSinglePlayerGame() {
  board = new Tris3dBoard()
  canvas.setAttribute('player', '1')
  canvas.setAttribute('moves', '')
  canvas.addEventListener('move', onmoveSinglePlayer)
}

addEventListener('load', () => {
  // Pre-fill the connection form with local server URL.
  document.querySelector('input#server-url').value = 'ws://localhost:3456'
  // Handle connection form submission.
  document.querySelector('form#connect').addEventListener('submit', connect)

  startSinglePlayerGame()
})
