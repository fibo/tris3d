// Expose pub-sub.
import { publish, subscribe } from '@tris3d/pubsub'
window.publish = publish
window.subscribe = subscribe

// Expose player colors.
import { playerColor } from '@tris3d/game'
window.playerColor = playerColor

// Expose dom components.
import { domComponent } from '../src/dom.js'
window.domComponent = domComponent

import '../src/index.js'
