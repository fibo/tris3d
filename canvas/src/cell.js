import { VECTOR_OF_POSITION } from '@tris3d/game'
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, SphereGeometry } from '@tris3d/three'
import { color } from './colors.js'

const { neutral } = color

class Sphere {
  opacity = {
    default: 0.071,
    highlighted: 0.4,
  }

  constructor(group) {
    this.material = new MeshBasicMaterial({
      color: neutral,
      transparent: true,
      opacity: this.opacity.default,
    })
    this.mesh = new Mesh(new SphereGeometry(1), this.material)
    group.add(this.mesh)
  }

  highlight(highlight) {
    if (highlight)
      this.material.opacity = this.opacity.highlighted
    else
      this.material.opacity = this.opacity.default
  }
}

class Cube {
  opacity = {
    default: 1,
    highlighted: 0.2,
  }

  constructor(group) {
    this.material = new MeshLambertMaterial({
      color: neutral,
      transparent: true,
      opacity: this.opacity.default,
    })
    const cubeSide = (2 * Math.sqrt(3) / 3).toFixed(2) // approx 1.15
    this.mesh = new Mesh(new BoxGeometry(cubeSide), this.material)
    group.add(this.mesh)
  }
}

export class Cell {
  isSelected = false

  group = new Group()

  constructor(position) {
    this.position = position

    this.sphere = new Sphere(this.group)
    this.piece = new Cube(this.group)

    this.reset()

    const [x, y, z] = VECTOR_OF_POSITION[position].map(coordinate => (coordinate - 1) * 2.2)
    this.group.position.set(x, y, z)
  }

  select(colorName) {
    this.isSelected = true
    this.piece.material.color.set(color[colorName])
    this.piece.mesh.visible = true
    this.sphere.mesh.visible = false
  }

  reset() {
    this.isSelected = false
    this.piece.mesh.visible = false
    this.sphere.mesh.visible = true
  }

  hide() {
    this.piece.mesh.visible = false
    this.sphere.mesh.visible = false
  }
}
