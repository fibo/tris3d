import { AmbientLight, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Raycaster, Scene, SphereGeometry, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Tris3dBoard } from '@tris3d/game'

/**
 * @example
 * <tris3d-canvas size="200" player="1" moves="ABC"></tris3d-canvas>
 */
class Tris3dCanvas extends HTMLElement {
  board = new Tris3dBoard()
  canvas = document.createElement('canvas')

  group = new Group()
  scene = new Scene()
  ambientLight = new AmbientLight(0x404040)
  ray = new Raycaster()

  cells = []
  size = 100

  shouldRotateGroup = true

  static observedAttributes = [
    'player',
    'moves',
    'size',
  ]

  get isReadOnly() {
    const { playerIndex, board } = this
    if (playerIndex === undefined) return true
    return board.turnPlayer !== playerIndex
  }

  connectedCallback() {
    this.style.display = 'inline-block'
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
      if (board.status === Tris3dBoard.IS_READONLY) {
        board.play()
      }
      const newMoves = newValue.split('')
      for (let i = board.moves.length; i < newMoves.length; i++) {
        if (board.gameIsOver) break
        const move = newMoves[i]
        const success = board.addMove(move)
        if (!success) break
      }
    }

    if (name === 'player') {
      const index = parseInt(newValue, 10)
      if (index >= 1 && index <= 3) {
        this.playerIndex = index - 1
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
      this.shouldRotateGroup = false
      if (this.isReadOnly) return
      const cell = this.pickCell(event)
      if (cell) {
        this.addMove('A')
        cell.material.transparent = false
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

  addMove(position) {
    const nextBoard = new Tris3dBoard(this.board.moves)
    nextBoard.play()
    const success = nextBoard.addMove(position)
    if (success) {
      const movesAttribute = this.getAttribute('moves') || ''
      this.setAttribute('moves', movesAttribute + position)
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
    const next = () => {
      let shoudRender = true
      if (this.shouldRotateGroup) {
        this.group.rotation.y += 0.005
      }
      if (shoudRender) {
        this.renderer.render(this.scene, this.camera)
      }
      requestAnimationFrame(next)
    }
    next() // Oh yeah!
  }

  pickCell(event) {
    const { canvas, camera, cells, ray } = this
    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    const pointerVector = new Vector3(x, y, 1)
    pointerVector.unproject(camera)
    ray.set(camera.position, pointerVector.sub(camera.position).normalize())
    const intersects = ray.intersectObjects(cells)
    const firstMatch = intersects[0]
    if (firstMatch) {
      return firstMatch.object
    }
  }

  setupCamera() {
    const fov = 75
    const aspect = 1
    const near = 0.1
    const far = 10
    const camera = this.camera = new PerspectiveCamera(fov, aspect, near, far)
    camera.position.y = 4
    camera.position.z = 6.5
  }

  setupControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enablePan = false
    controls.enableZoom = false
    controls.update()
    controls.addEventListener('change', () => {
      this.shouldRotateGroup = false
    })
  }

  setupGeometry() {
    const { group, scene } = this
    for (let x = -2; x <= 2; x += 2)
      for (let y = -2; y <= 2; y += 2)
        for (let z = -2; z <= 2; z += 2) {
          const geometry = new SphereGeometry(1)
          const material = new MeshBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.1,
          })
          const sphere = new Mesh(geometry, material)
          sphere.position.set(x, y, z)
          group.add(sphere)
          this.cells.push(sphere)
        }
    scene.add(group)
  }

  setupLights() {
    const { scene } = this
    scene.add(this.ambientLight)
  }
}

customElements.define('tris3d-canvas', Tris3dCanvas)
