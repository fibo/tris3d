import { AmbientLight, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Raycaster, Scene, SphereGeometry, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Tris3dBoard } from '@tris3d/game'

class Tris3dCanvas extends HTMLElement {
  board = new Tris3dBoard()
  canvas = document.createElement('canvas')

  group = new Group()
  scene = new Scene()
  ambientLight = new AmbientLight(0x404040)
  ray = new Raycaster()

  cells = []

  size = 500
  shouldRotateGroup = true

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

  handleEvent(event) {
    if (event.type === 'pointerdown') {
      this.shouldRotateGroup = false
      const cell = this.pickCell(event)
      if (cell) {
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

  setStyle() {
    const { style } = this
    style.display = 'inline-block'
    style.border = '1px solid'
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
