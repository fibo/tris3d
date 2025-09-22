import { subscribe } from '@tris3d/state'
import { Multiplayer } from './Multiplayer.js'
import { Training } from './Training.js'

export class PlaymodeController {
  #mode = {
    multiplayer: new Multiplayer(),
    training: new Training(),
  }

  constructor() {
    subscribe('playmode', (playmode, get) => {
      const previous = get('playmode')
      if (playmode === previous)
        return
      if (previous)
        this.#mode[previous].disable()
      this.#mode[playmode].enable()
    })
  }
}
