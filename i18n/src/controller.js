import { translation } from './translations.js'

export class I18nController {
  #lang = 'en'

  translate(key) {
    return translation[this.#lang][key] || key
  }
}

export const i18n = new I18nController()
