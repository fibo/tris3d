import { VECTOR_OF_POSITION } from '@tris3d/game'
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, SphereGeometry } from '@tris3d/three'

const neutralColor = 0x333333

export class Cell {
  group = new Group()
  cubeMaterial = new MeshLambertMaterial({
    color: neutralColor,
  })

  sphereMaterial = new MeshBasicMaterial({
    color: neutralColor,
    transparent: true,
    opacity: 0.071,
  })

  constructor(position) {
    this.position = position

    const sphere = this.sphere = new Mesh(new SphereGeometry(1), this.sphereMaterial)
    this.group.add(sphere)

    const cubeSide = (2 * Math.sqrt(3) / 3).toFixed(2) // approx 1.15
    const cube = this.cube = new Mesh(new BoxGeometry(cubeSide), this.cubeMaterial)
    cube.visible = false
    this.group.add(cube)

    const [x, y, z] = VECTOR_OF_POSITION[position].map(coordinate => (coordinate - 1) * 2.2)
    this.group.position.set(x, y, z)
  }

  select(color) {
    this.cubeMaterial.color.set(color)
    this.cube.visible = true
    this.sphere.visible = false
  }

  deselect() {
    this.cubeMaterial.color.set(neutralColor)
    this.cube.visible = false
    this.sphere.visible = true
  }
}
