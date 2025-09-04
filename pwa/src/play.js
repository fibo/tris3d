import '@tris3d/ui'

document.querySelector('header').remove()
document.querySelector('noscript').remove()
document.querySelector('button#play').remove()

const playground = document.createElement('tris3d-playground')
playground.setAttribute('websocket', 'ws://tris3d-server.inversive.net:3456')
document.body.appendChild(playground)
