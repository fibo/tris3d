import { hide, show } from './dom.js'

export function showIfPlaymode(playmode, element) {
  hide(element)
  return function (current) {
    if (playmode === current) show(element)
    else hide(element)
  }
}
