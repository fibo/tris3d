import 'design-canvas'

// Do not import webStorage.js here,
// cause it would override some state.
import '../src/logic.js'
import '../src/elements/index.js'

// Expose pub-sub.
import { publish, subscribe } from '@tris3d/game'
window.publish = publish
window.subscribe = subscribe
