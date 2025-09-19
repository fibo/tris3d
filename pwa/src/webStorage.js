import { publish, subscribe } from '@tris3d/state'

// nickname

subscribe('nickname', (value) => {
  if (typeof value === 'string')
    localStorage.setItem('nickname', value)
})

const nickname = localStorage.getItem('nickname')
if (nickname !== null)
  publish('nickname', nickname)

// local_players

subscribe('local_players', (value) => {
  if (Array.isArray(value))
    localStorage.setItem('local_players', JSON.stringify(value))
})
const localPlayers = localStorage.getItem('local_players')
if (localPlayers !== null)
  publish('local_players', JSON.parse(localPlayers))
