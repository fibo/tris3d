import { publish } from '@tris3d/state'

export function updateMultiplayerAction(connected) {
  if (connected === undefined)
    return
  if (connected === false)
    publish('action', 'connect')
}
