import { AmbientLight, Group, PerspectiveCamera, Raycaster, Scene, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { POSITIONS, GameBoard } from '@tris3d/game'
import { Cell } from './cell.js'

const radian = 2 * Math.PI / 360
const angularSpeed = 17 * radian // radians per second

/**
 * @example
 * <tris3d-canvas size="200" player="1" moves="ABC"></tris3d-canvas>
 */
class Tris3dCanvas extends HTMLElement {
  // Frames per second
  FPS = 25

  board = new GameBoard()
  canvas = document.createElement('canvas')

  cellsGroup = new Group()
  scene = new Scene()
  ambientLight = new AmbientLight(0x404040)
  ray = new Raycaster()

  size = 100

  positionCellMap = new Map()
  cellSphereUuidPositionMap = new Map()

  shouldRotateGroup = true
  idleTimeoutId = 0
  idleTimeout = 10_000

  static observedAttributes = [
    'fps',
    'player',
    'moves',
    'size',
  ]

  get availableCellSpheres() {
    const { board, positionCellMap } = this
    const spheres = []
    for (const [position, cell] of positionCellMap) {
      if (board.moves.includes(position)) continue
      spheres.push(cell.sphere)
    }
    return spheres
  }

  get isReadOnly() {
    const { playerIndex, board } = this
    if (playerIndex === undefined) return true
    return board.turnPlayer !== playerIndex
  }

  connectedCallback() {
    this.setStyle()
    this.createRenderer()
    this.setupCamera()
    this.setupControls()
    this.setupGeometry()
    this.setupLights()
    this.addEventListeners()
    this.mainLoop()
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'moves') {
      const { board } = this
      if (typeof newValue !== 'string') return
      const newMoves = newValue.split('')
      for (let i = board.moves.length; i < newMoves.length; i++) {
        if (board.gameIsOver) break
        const position = newMoves[i]
        const success = board.addMove(position)
        if (!success) break
        const cell = this.positionCellMap.get(position)
        if (cell) cell.select()
      }
    }

    if (name === 'fps') {
      const fps = parseInt(newValue, 10)
      if (fps >= 20 && fps <= 60) {
        this.FPS = fps
      }
    }

    if (name === 'player') {
      const index = parseInt(newValue, 10)
      if (index >= 0 && index <= 2) {
        this.playerIndex = index
      }
    }

    if (name === 'size') {
      let size = parseInt(newValue, 10)
      size = Math.min(Math.max(size, 100), 700)
      this.size = size
      this.style.width = `${size}px`
      this.style.height = `${size}px`
      this.renderer?.setSize(size, size)
    }
  }

  handleEvent(event) {
    if (event.type === 'pointerdown') {
      this.gotUserInput()
      if (this.isReadOnly) return
      const cell = this.pickCell(event)
      if (cell) {
        this.addMove(cell.position)
        cell.select()
      }
    }
  }

  addEventListeners() {
    const { canvas } = this
    canvas.addEventListener('pointerdown', this)
  }

  removeEventListeners() {
    const { canvas } = this
    canvas.removeEventListener('pointerdown', this)
  }

  setStyle() {
    this.style.display = 'inline-block'
    this.style.borderStyle = 'solid'
    this.style.borderWidth = 'var(--border-width)'
    this.style.borderColor = 'var(--border-color)'
    this.style.borderRadius = 'var(--border-radius-large)'
  }

  addMove(position) {
    const nextBoard = new GameBoard(this.board.moves)
    const success = nextBoard.addMove(position)
    if (success) {
      const movesAttribute = this.getAttribute('moves') || ''
      this.setAttribute('moves', movesAttribute + position)
      this.dispatchEvent(new CustomEvent('move', { detail: { position } }))
    }
  }

  createRenderer() {
    const { canvas, size } = this
    const renderer = this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(window.devicePixelRatio)
    // Attach canvas to this DOM element
    this.appendChild(canvas)
  }

  mainLoop() {
    let lastTime = document.timeline.currentTime
    const next = () => {
      const { FPS } = this
      const deltaT = 1000 / FPS
      const shoudRender = document.timeline.currentTime - lastTime > deltaT
      if (shoudRender) {
        if (this.shouldRotateGroup) {
          this.cellsGroup.rotation.y += angularSpeed / FPS
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
    const rect = this.canvas.getBoundingClientRect()
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
    scene.add(this.ambientLight)
  }
}

const tagName = 'tris3d-canvas'
customElements.get(tagName) || customElements.define(tagName, Tris3dCanvas)
