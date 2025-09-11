import 'infinite-paper'

import '../src/elements/index.js'

import { publish, subscribe } from '@tris3d/game'

window.publish = publish
window.subscribe = subscribe
