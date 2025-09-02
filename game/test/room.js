import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { GameRoom } from '@tris3d/game'

test('start new game in a room', () => {
  const room = new GameRoom('test')
  const clientId1 = 'client1'
  const clientId2 = 'client2'
  const clientId3 = 'client3'
  const clientId4 = 'client4'

  room.addClient(clientId1)
  room.addClient(clientId2)
  // Client 3 will be added as player
  room.addClient(clientId4)

  assert.equal(room.numClients, 3, 'num clients')
  assert.equal(room.numPlayers, 0, 'no player yet')

  assert.equal(room.setPlayer(clientId1), true, 'set player 1')
  assert.equal(room.numPlayers, 1, 'num players after 1st')

  assert.equal(room.setPlayer(clientId2), true, 'set player 2')
  assert.equal(room.numPlayers, 2, 'num players after 2nd')

  assert.equal(room.setPlayer(clientId1), false, 'set again player 1')
  assert.equal(room.numPlayers, 2, 'num players is still 2')

  assert.equal(room.setPlayer(clientId3), true, 'set player 3')
  assert.equal(room.numPlayers, 3, 'num players after 3rd')

  assert.equal(room.numClients, 4, 'num clients is 4, client3 was added as player')
})
