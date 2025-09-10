import { publish, subscribe } from '@tris3d/game'

// nickname

subscribe('nickname', (nickname) => {
  if (!nickname) return
  localStorage.setItem('nickname', nickname)
})

const nickname = localStorage.getItem('nickname')
if (nickname)
  publish('nickname', nickname)

// local-players

subscribe('local-players', (localPlayers) => {
  if (localPlayers)
    localStorage.setItem('local-players', JSON.stringify(localPlayers))
})
const storedLocalPlayers = localStorage.getItem('local-players')
if (storedLocalPlayers)
  publish('local-players', JSON.parse(storedLocalPlayers))
