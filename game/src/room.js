export class GameRoom {
  #clients = new Set()

  #players = [null, null, null]

  constructor(id) {
    this.id = id
  }

  get numClients() {
    return this.#clients.size
  }

  get numPlayers() {
    return this.#players.filter(p => p !== null).length
  }

  addClient(clientId) {
    this.#clients.add(clientId)
  }

  removeClient(id) {
    this.#clients.delete(id)
    for (let i = 0; i < 3; i++) {
      const player = this.#players[i]
      if (!player) continue
      if (player.id === id) {
        this.#players[i] = null
        break
      }
    }
  }

  getPlayer(index) {
    return this.#players[index]
  }

  /**
   * @param {string} clientId
   * @param {number} index
   * @return {boolean} true if the player was added, false otherwise.
   */
  setPlayer(clientId) {
    if (this.numPlayers > 3) return false
    if (this.#players.includes(clientId)) return false
    const index = this.numPlayers
    this.#players[index] = clientId
    this.addClient(clientId)
    return true
  }
}
