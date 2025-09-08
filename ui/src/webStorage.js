import { subscribe } from '@tris3d/game'

// Local Storage is read only on page load.
// It is written only by subscribers in this file.

export function getStoredNickname() {
  return localStorage.getItem('nickname') || ''
}
subscribe('nickname', (nickname) => {
  if (!nickname) return
  localStorage.setItem('nickname', nickname)
})

export function getStoredLocalPlayers() {
  const storedLocalPlayers = localStorage.getItem('local-players') ?? JSON.stringify(['human', 'stupid', 'stupid'])
  return JSON.parse(storedLocalPlayers)
}
subscribe('local-players', (localPlayers) => {
  if (!Array.isArray(localPlayers)) return
  if (localPlayers.length !== 3) return
  localStorage.setItem('local-players', JSON.stringify(localPlayers))
})
