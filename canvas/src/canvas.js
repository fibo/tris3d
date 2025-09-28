import { AmbientLight, DirectionalLight, Group, PerspectiveCamera, OrbitControls, Raycaster, Scene, Vector3, WebGLRenderer } from '@tris3d/three'
import { POSITIONS, defaultPlayerColors } from '@tris3d/game'
import { Cell } from './cell.js'
import { color } from './colors.js'

const tagName = 'tris3d-canvas'

const radian = 2 * Math.PI / 360
const angularSpeed = 17 * radian // radians per second

const sheet = new CSSStyleSheet()
sheet.replaceSync([tagName, '{ min-width: fit-content; }'].join(''))
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]

const { silver, white } = color

// Minimum frames per second is 18, maximum is 60.
const minFPS = 18

/**
 * @example
 * <tris3d-canvas size="200" moves="ABC"></tris3d-canvas>
 */
class Tris3dCanvas extends HTMLElement {
  static observedAttributes = [
    'fps',
    'playercolors',
    'moves',
    'readonly',
    'size',
    'winninglines',
  ]

  // Frames per second
  FPS = minFPS

  // On pointerdown pick a cell and store it here.
  // Then on pointerup check if the same cell is picked.
  cellAtPointerdown = null

  playerColors = defaultPlayerColors

  cellsGroup = new Group()
  scene = new Scene()
  ray = new Raycaster()

  size = 300

  positionCellMap = new Map()
  cellUuidPositionMap = new Map()
  boardMoves = []

  shouldRotateGroup = true
  shouldResize = true

  idleTimeoutId = 0
  idleTimeout = 10_000

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
        if (newValue === '' || !newValue.includes(oldValue))
          this.resetMoves()
        const newMoves = newValue.split('')
        for (let i = this.boardMoves.length; i < newMoves.length; i++) {
          const position = newMoves[i]
          const cell = this.positionCellMap.get(position)
          const color = this.playerColors[i % 3]
          if (cell)
            cell.select(color)
        }
        this.boardMoves = newMoves
      }
    }

    if (name === 'fps') {
      const fps = parseInt(newValue, 10)
      if (fps >= minFPS && fps <= 60)
        this.FPS = fps
    }

    if (name === 'playercolors') {
      if (newValue === null)
        this.playerColors = defaultPlayerColors
      else
        this.playerColors = newValue.split(',')
    }

    if (name === 'readonly') {
      this.isReadOnly = newValue !== null
    }

    if (name === 'size') {
      let size = parseInt(newValue, 10)
      size = Math.min(Math.max(size, 100), 700)
      this.size = size
      this.shouldResize = true
    }

    if (name === 'winninglines') {
      if (newValue === null) return
      const lines = newValue.split(',')
      for (const [position, cell] of this.positionCellMap.entries()) {
        if (cell.isSelected) {
          if (!lines.some(line => line.includes(position)))
            cell.piece.dim()
        } else cell.hide()
      }
    }
  }

  handleEvent(event) {
    if (event.type === 'pointerdown') {
      this.gotUserInput()
      this.cellAtPointerdown = this.pickCell(event)
    }

    if (event.type === 'pointerup') {
      const cell = this.pickCell(event)
      if (!cell) return
      if (cell !== this.cellAtPointerdown) return // prevents mis-clicks
      if (this.isReadOnly) {
        if (!cell.isSelected) {
          for (const otherCell of this.positionCellMap.values())
            otherCell.placeholder.highlight(false)
          cell.placeholder.highlight(true)
        }
      } else {
        if (!cell.isSelected) {
          this.dispatchEvent(
            new CustomEvent('move', { detail: { position: cell.position } })
          )
        }
      }
    }
  }

  get availableCellSpheres() {
    const spheres = []
    for (const [position, cell] of this.positionCellMap) {
      if (!this.boardMoves.includes(position))
        spheres.push(cell.placeholder.mesh)
    }
    return spheres
  }

  get choosenCellPieces() {
    const meshes = []
    for (const [position, cell] of this.positionCellMap) {
      if (this.boardMoves.includes(position))
        meshes.push(cell.piece.mesh)
    }
    return meshes
  }

  addEventListeners() {
    ['pointerdown', 'pointerup'].forEach(eventName =>
      this.renderer.domElement.addEventListener(eventName, this))
  }

  removeEventListeners() {
    ['pointerdown', 'pointerup'].forEach(eventName =>
      this.renderer.domElement.removeEventListener(eventName, this))
  }

  createRenderer() {
    const renderer = this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: document.createElement('canvas'),
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    this.appendChild(renderer.domElement)
  }

  mainLoop() {
    let lastTime = document.timeline.currentTime
    const next = () => {
      if (
        // Should we render a new frame?
        // IF deltaT time has elapsed since lastTime scene was rendered;
        // THEN render the scene.
        document.timeline.currentTime - lastTime > /* deltaT */ 1000 / this.FPS
      ) {
        if (this.shouldRotateGroup)
          this.cellsGroup.rotation.y += angularSpeed / this.FPS

        if (this.shouldResize)
          this.resize()

        this.controls.update()
        this.renderer.render(this.scene, this.camera)

        lastTime = document.timeline.currentTime
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
    const { camera, ray, rect } = this
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    const pointerVector = new Vector3(x, y, 1)
    pointerVector.unproject(camera)
    ray.set(camera.position, pointerVector.sub(camera.position).normalize())
    const intersects = ray.intersectObjects([
      ...this.availableCellSpheres,
      ...this.choosenCellPieces,
    ])
    const firstMatch = intersects[0]
    if (firstMatch) {
      const group = firstMatch.object.parent
      const position = this.cellUuidPositionMap.get(group.uuid)
      return this.positionCellMap.get(position)
    }
  }

  resetMoves() {
    this.boardMoves = []
    for (const cell of this.positionCellMap.values()) {
      cell.placeholder.highlight(false)
      cell.reset()
    }
  }

  resize() {
    this.renderer.setSize(this.size, this.size)
    this.rect = this.renderer.domElement.getBoundingClientRect()
    this.shouldResize = false
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
    const controls = this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.17
    controls.enablePan = false
    controls.enableZoom = false
    controls.update()
    controls.addEventListener('change', () => {
      this.gotUserInput()
    })
  }

  setupGeometry() {
    const { cellsGroup, cellUuidPositionMap, positionCellMap, scene } = this
    for (let i = 0; i < POSITIONS.length; i++) {
      const position = POSITIONS[i]
      const cell = new Cell(position)
      cellsGroup.add(cell.group)
      positionCellMap.set(position, cell)
      cellUuidPositionMap.set(cell.group.uuid, position)
    }
    scene.add(cellsGroup)
  }

  setupLights() {
    const { scene } = this

    const directionalLight0 = new DirectionalLight(white)
    directionalLight0.position.x = 6
    directionalLight0.position.y = -4
    directionalLight0.position.z = 0
    directionalLight0.position.normalize()
    scene.add(directionalLight0)

    const directionalLight1 = new DirectionalLight(white)
    directionalLight1.position.x = -3
    directionalLight1.position.y = 0
    directionalLight1.position.z = 5
    directionalLight1.position.normalize()
    scene.add(directionalLight1)

    const directionalLight2 = new DirectionalLight(white)
    directionalLight2.position.x = 0
    directionalLight2.position.y = 9
    directionalLight2.position.z = -5
    directionalLight2.position.normalize()
    scene.add(directionalLight2)

    const directionalLight3 = new DirectionalLight(white)
    directionalLight3.position.x = -2
    directionalLight3.position.y = 4
    directionalLight3.position.z = 0
    directionalLight3.position.normalize()
    scene.add(directionalLight3)

    const directionalLight4 = new DirectionalLight(white)
    directionalLight4.position.x = 3
    directionalLight4.position.y = 0
    directionalLight4.position.z = -2
    directionalLight4.position.normalize()
    scene.add(directionalLight4)

    const directionalLight5 = new DirectionalLight(white)
    directionalLight5.position.x = 0
    directionalLight5.position.y = -7
    directionalLight5.position.z = 1
    directionalLight5.position.normalize()
    scene.add(directionalLight5)

    const ambientLight = new AmbientLight(silver)
    scene.add(ambientLight)
  }
}

customElements.get(tagName) || customElements.define(tagName, Tris3dCanvas)
