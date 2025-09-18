import 'design-canvas'

// Expose pub-sub.
import { publish, subscribe } from '@tris3d/state'
window.publish = publish
window.subscribe = subscribe

// Do not import webStorage.js here,
// cause it would override some state.
import '../src/state.js'
import '../src/elements/index.js'
