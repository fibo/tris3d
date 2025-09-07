// Local Storage is read only on page load.

const storedNickname = localStorage.getItem('nickname') || ''
export function getStoredNickname() {
  return storedNickname
}
export function setStoredNickname(nickname) {
  localStorage.setItem('nickname', nickname)
}

const storedLocalPlayers = localStorage.getItem('local players') ?? JSON.stringify(['human', 'stupid', 'stupid'])
export function getStoredLocalPlayers() {
  return JSON.parse(storedLocalPlayers)
}
export function setStoredLocalPlayers(localPlayers) {
  localStorage.setItem('local players', JSON.stringify(localPlayers))
}
