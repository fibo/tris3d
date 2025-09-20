import { translate } from '@tris3d/i18n'

class I18nController {
  #lang = 'en'
  translate(key) {
    return translate(this.#lang, key)
  }
}

export const i18n = new I18nController()
