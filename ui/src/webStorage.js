import { publish, subscribe } from '@tris3d/state'

// nickname

subscribe('nickname', (nickname) => {
  if (typeof nickname === 'string')
    localStorage.setItem('nickname', nickname)
})

const nickname = localStorage.getItem('nickname')
if (nickname !== null)
  publish('nickname', nickname)

// local-players

subscribe('local-players', (localPlayers) => {
  if (Array.isArray(localPlayers))
    localStorage.setItem('local-players', JSON.stringify(localPlayers))
})
const storedLocalPlayers = localStorage.getItem('local-players')
if (storedLocalPlayers !== null)
  publish('local-players', JSON.parse(storedLocalPlayers))
