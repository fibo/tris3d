import '@tris3d/canvas'

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

addEventListener('load', () => {
  // Pre-fill the connection form with local server URL.
  document.querySelector('input#server-url').value = 'ws://localhost:3456'
  // Handle connection form submission.
  document.querySelector('form#connect').addEventListener('submit', connect)
})
