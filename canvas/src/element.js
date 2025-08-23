import { AmbientLight, BoxGeometry, Mesh, MeshBasicMaterial, Scene, PerspectiveCamera, WebGLRenderer } from 'three'

class Tris3dCanvas extends HTMLElement {
  canvas = document.createElement('canvas')
  scene = new Scene()
  camera = new PerspectiveCamera(75, 1, 0.1, 1000)
  ambientLight = new AmbientLight(0x404040)

  size = 200

  constructor() {
    super()
    const { canvas } = this
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
    this.appendChild(canvas)
  }

  connectedCallback() {
    const { camera, renderer, scene, size } = this

    this.#setupLights()

    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshBasicMaterial({ color: 0x333333 })
    const cube = new Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 2
    renderer.setSize(size, size)

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })
  }

  #setupLights() {
    const { scene } = this
    scene.add(this.ambientLight)
  }
}

customElements.define('tris3d-canvas', Tris3dCanvas)
