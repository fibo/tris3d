import './state/initialization.js'

import './state/game_over.js'
import './state/moves.js'
import './state/playing.js'
import './state/winner_score.js'

import { PlaymodeController } from './PlaymodeController.js'
new PlaymodeController()

export { i18n } from './I18nController.js'

export { StateController } from './StateController.js'
