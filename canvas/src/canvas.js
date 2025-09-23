import { AmbientLight, DirectionalLight, Group, PerspectiveCamera, OrbitControls, Raycaster, Scene, Vector3, WebGLRenderer } from '@tris3d/three'
import { POSITIONS } from '@tris3d/game'
import { Cell } from './cell.js'

const tagName = 'tris3d-canvas'

const radian = 2 * Math.PI / 360
const angularSpeed = 17 * radian // radians per second

const playerColors = [
  0xff0000, // Player 0: Red
  0x00ff00, // Player 1: Green
  0x0000ff, // Player 2: Blue
]

/**
 * @example
 * <tris3d-canvas size="200" player="1" moves="ABC"></tris3d-canvas>
 */
class Tris3dCanvas extends HTMLElement {
  static observedAttributes = [
    'fps',
    'player',
    'moves',
    'readonly',
    'size',
  ]

  // Frames per second
  FPS = 25

  cellsGroup = new Group()
  scene = new Scene()
  ray = new Raycaster()

  size = 100

  positionCellMap = new Map()
  cellSphereUuidPositionMap = new Map()
  boardMoves = []

  shouldRotateGroup = true
  shouldResize = false

  idleTimeoutId = 0
  idleTimeout = 10_000

  get availableCellSpheres() {
    const spheres = []
    for (const [position, cell] of this.positionCellMap) {
      if (this.boardMoves.includes(position))
        continue
      spheres.push(cell.sphere)
    }
    return spheres
  }

  connectedCallback() {
    this.createRenderer()
    this.setupCamera()
    this.setupControls()
    this.setupGeometry()
    this.setupLights()
    this.addEventListeners()
    this.mainLoop()
  }

  disconnectedCallback() {
    this.renderer.dispose()
    this.removeEventListeners()
    clearTimeout(this.idleTimeoutId)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'moves') {
      if (newValue === null)
        this.resetMoves()
      else {
        if (!newValue.includes(oldValue))
          this.resetMoves()
        const newMoves = newValue.split('')
        for (let i = this.boardMoves.length; i < newMoves.length; i++) {
          const position = newMoves[i]
          const cell = this.positionCellMap.get(position)
          const color = playerColors[i % 3]
          if (cell)
            cell.select(color)
        }
        this.boardMoves = newMoves
      }
    }

    if (name === 'fps') {
      const fps = parseInt(newValue, 10)
      if (fps >= 20 && fps <= 60) {
        this.FPS = fps
      }
    }

    if (name === 'readonly') {
      this.isReadOnly = newValue !== null
    }

    if (name === 'size') {
      let size = parseInt(newValue, 10)
      size = Math.min(Math.max(size, 100), 700)
      this.size = size
      this.style.width = `${size}px`
      this.style.height = `${size}px`
      this.shouldResize = true
    }
  }

  handleEvent(event) {
    if (event.type === 'pointerdown') {
      this.gotUserInput()
      if (this.isReadOnly) return
      const cell = this.pickCell(event)
      if (cell) {
        this.dispatchEvent(new CustomEvent('move', { detail: { position: cell.position } }))
      }
    }
  }

  addEventListeners() {
    this.renderer.domElement.addEventListener('pointerdown', this)
  }

  removeEventListeners() {
    this.renderer.domElement.removeEventListener('pointerdown', this)
  }

  createRenderer() {
    const renderer = this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: document.createElement('canvas'),
    })
    renderer.setSize(this.size, this.size)
    renderer.setPixelRatio(window.devicePixelRatio)
    this.appendChild(renderer.domElement)
  }

  mainLoop() {
    let lastTime = document.timeline.currentTime
    const next = () => {
      if (
        // Should we render a new frame?
        // Yes, it deltaT time has elapsed since lastTime scene was rendered.
        document.timeline.currentTime - lastTime > /* deltaT */ 1000 / this.FPS
      ) {
        if (this.shouldRotateGroup) {
          this.cellsGroup.rotation.y += angularSpeed / this.FPS
        }
        if (this.shouldResize) {
          this.renderer.setSize(this.size, this.size)
          this.shouldResize = false
        }
        lastTime = document.timeline.currentTime
        this.renderer.render(this.scene, this.camera)
      }
      requestAnimationFrame(next)
    }
    next() // Oh yeah!
  }

  gotUserInput() {
    this.shouldRotateGroup = false
    clearTimeout(this.idleTimeoutId)
    this.idleTimeoutId = setTimeout(() => {
      this.shouldRotateGroup = true
    }, this.idleTimeout)
  }

  pickCell(event) {
    const { camera, ray } = this
    const rect = this.renderer.domElement.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    const pointerVector = new Vector3(x, y, 1)
    pointerVector.unproject(camera)
    ray.set(camera.position, pointerVector.sub(camera.position).normalize())
    const intersects = ray.intersectObjects(this.availableCellSpheres)
    const firstMatch = intersects[0]
    if (firstMatch) {
      const position = this.cellSphereUuidPositionMap.get(firstMatch.object.uuid)
      return this.positionCellMap.get(position)
    }
  }

  resetMoves() {
    this.boardMoves = []
    for (const cell of this.positionCellMap.values())
      cell.deselect()
  }

  setupCamera() {
    const fov = 75
    const aspect = 1
    const near = 0.1
    const far = 17
    const camera = this.camera = new PerspectiveCamera(fov, aspect, near, far)
    camera.position.y = 4
    camera.position.z = 7
  }

  setupControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enablePan = false
    controls.enableZoom = false
    controls.update()
    controls.addEventListener('change', () => {
      this.gotUserInput()
    })
  }

  setupGeometry() {
    const { cellsGroup, cellSphereUuidPositionMap, positionCellMap, scene } = this
    for (let i = 0; i < POSITIONS.length; i++) {
      const position = POSITIONS[i]
      const cell = new Cell(position)
      cellsGroup.add(cell.group)
      positionCellMap.set(position, cell)
      cellSphereUuidPositionMap.set(cell.sphere.uuid, position)
    }
    scene.add(cellsGroup)
  }

  setupLights() {
    const { scene } = this

    const directionalLight0 = new DirectionalLight(0xe7feff)
    directionalLight0.position.x = 6
    directionalLight0.position.y = -4
    directionalLight0.position.z = 0
    directionalLight0.position.normalize()
    scene.add(directionalLight0)

    const directionalLight1 = new DirectionalLight(0xe7feff)
    directionalLight1.position.x = -3
    directionalLight1.position.y = 0
    directionalLight1.position.z = 5
    directionalLight1.position.normalize()
    scene.add(directionalLight1)

    const directionalLight2 = new DirectionalLight(0xe7feff)
    directionalLight2.position.x = 0
    directionalLight2.position.y = 9
    directionalLight2.position.z = -5
    directionalLight2.position.normalize()
    scene.add(directionalLight2)

    const directionalLight3 = new DirectionalLight(0xe7feff)
    directionalLight3.position.x = -2
    directionalLight3.position.y = 4
    directionalLight3.position.z = 0
    directionalLight3.position.normalize()
    scene.add(directionalLight3)

    const directionalLight4 = new DirectionalLight(0xe7feff)
    directionalLight4.position.x = 3
    directionalLight4.position.y = 0
    directionalLight4.position.z = -2
    directionalLight4.position.normalize()
    scene.add(directionalLight4)

    const directionalLight5 = new DirectionalLight(0xe7feff)
    directionalLight5.position.x = 0
    directionalLight5.position.y = -7
    directionalLight5.position.z = 1
    directionalLight5.position.normalize()
    scene.add(directionalLight5)

    const ambientLight = new AmbientLight(0x404040)
    scene.add(ambientLight)
  }
}

customElements.get(tagName) || customElements.define(tagName, Tris3dCanvas)
