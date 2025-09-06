import '@tris3d/ui'

// Cleanup the body.
while (document.body.lastChild)
  document.body.removeChild(document.body.lastChild)

// Init UI.
const playground = document.createElement('tris3d-playground')
playground.setAttribute('websocket', 'ws://tris3d-server.inversive.net:3456')
document.body.appendChild(playground)
