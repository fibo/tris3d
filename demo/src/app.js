import '@tris3d/canvas'
import '@tris3d/ui'

addEventListener('load', () => {
  const playground = document.createElement('game-playground')
  playground.setAttribute('debug', 'true')
  playground.setAttribute('websocket', WEBSOCKET_URL)
  document.body.appendChild(playground)
})
