import 'design-canvas'

// Expose pub-sub.
import { publish, subscribe } from '@tris3d/state'
window.publish = publish
window.subscribe = subscribe

import '../src/index.js'
