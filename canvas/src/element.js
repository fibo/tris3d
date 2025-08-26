import { AmbientLight, BoxGeometry, Mesh, MeshBasicMaterial, Scene, PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Tris3dBoard } from 'tris3d-game'

class Tris3dCanvas extends HTMLElement {
  board = new Tris3dBoard()
  scene = new Scene()
  ambientLight = new AmbientLight(0x404040)

  size = 500
  shouldAnimate = true

  connectedCallback() {
    this.setStyle()
    this.createRenderer()
    this.setupCamera()
    this.setupControls()
    this.setupGeometry()
    this.setupLights()
    this.mainLoop()
  }

  createRenderer() {
    const { size } = this
    const canvas = document.createElement('canvas')
    const renderer = this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(window.devicePixelRatio)
    // Attach canvas to this DOM element
    this.appendChild(canvas)
  }

  mainLoop() {
    const next = () => {
      if (this.shouldAnimate) {
        this.shouldAnimate = false
        this.renderer.render(this.scene, this.camera)
      }
      requestAnimationFrame(next)
    }
    next() // Oh yeah!
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
    const far = 5
    const camera = this.camera = new PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2
  }

  setupControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enablePan = false
    controls.enableZoom = false
    controls.update()
    controls.addEventListener('change', () => {
      this.shouldAnimate = true
    })
  }

  setupGeometry() {
    const { scene } = this
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshBasicMaterial({ color: 0x333333 })
    const cube = new Mesh(geometry, material)
    scene.add(cube)
  }

  setupLights() {
    const { scene } = this
    scene.add(this.ambientLight)
  }
}

customElements.define('tris3d-canvas', Tris3dCanvas)
