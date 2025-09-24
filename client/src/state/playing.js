import { publish } from '@tris3d/state'

export function updateTrainingAction(playing) {
  if (playing === undefined)
    publish('action', 'start')
  if (playing === true)
    publish('action', 'quit')
  else if (playing === false)
    publish('action', 'start')
}

export function resetBoard(playing) {
  if (playing === true)
    publish('moves', [])
}
