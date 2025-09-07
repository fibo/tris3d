import '@tris3d/ui'

// Cleanup the body.
while (document.body.lastChild)
  document.body.removeChild(document.body.lastChild)

// Init UI.

const playground = document.createElement('tris3d-playground')
playground.setAttribute('websocket', WEBSOCKET_URL)
document.body.appendChild(playground)
