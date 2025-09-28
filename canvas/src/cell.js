import { VECTOR_OF_POSITION } from '@tris3d/game'
import { Group, Mesh, MeshLambertMaterial, SphereGeometry } from '@tris3d/three'
import { color } from './colors.js'

const { silver, white } = color

class GlassSphere {
  constructor(group) {
    this.material = new MeshLambertMaterial({
      color: white,
      transparent: true,
    })
    this.mesh = new Mesh(new SphereGeometry(0.68), this.material)
    group.add(this.mesh)
  }
}

class Placeholder {
  constructor(group) {
    this.material = new MeshLambertMaterial({
      color: white,
      transparent: true,
    })
    this.mesh = new Mesh(new SphereGeometry(0.5), this.material)
    group.add(this.mesh)
  }

  highlight(highlight) {
    if (highlight)
      this.material.color.set(silver)
    else
      this.material.color.set(white)
  }
}

export class Cell {
  isSelected = false

  group = new Group()

  constructor(position) {
    this.position = position

    this.placeholder = new Placeholder(this.group)
    this.piece = new GlassSphere(this.group)

    this.reset()

    const [x, y, z] = VECTOR_OF_POSITION[position].map(coordinate => (coordinate - 1) * 2.2)
    this.group.position.set(x, y, z)
  }

  select(colorName) {
    this.isSelected = true
    this.piece.material.color.set(color[colorName])
    this.piece.mesh.visible = true
    this.placeholder.mesh.visible = false
  }

  reset() {
    this.isSelected = false
    this.piece.mesh.visible = false
    this.placeholder.mesh.visible = true
  }

  hide() {
    this.piece.mesh.visible = false
    this.placeholder.mesh.visible = false
  }
}
