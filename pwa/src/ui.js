// Order matters,
// load web storage first cause it may publish some persistent state.
import './webStorage.js'
import '@tris3d/ui'

// Cleanup the body.
while (document.body.lastChild)
  document.body.removeChild(document.body.lastChild)

// Init UI.

const playground = document.createElement('play-ground')
playground.setAttribute('websocket', WEBSOCKET_URL)
document.body.appendChild(playground)
