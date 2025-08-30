import { VECTOR_OF_POSITION } from '@tris3d/game'
import { Group, Mesh, MeshBasicMaterial, SphereGeometry } from 'three'

export class Cell {
  group = new Group()
  sphereMaterial = new MeshBasicMaterial({
    color: 0x333333,
    transparent: true,
    opacity: 0.1,
  })

  constructor(position) {
    this.position = position
    const sphere = this.sphere = new Mesh(new SphereGeometry(1), this.sphereMaterial)
    this.group.add(sphere)
    const [x, y, z] = VECTOR_OF_POSITION[position].map(coordinate => (coordinate - 1) * 2.2)
    this.group.position.set(x, y, z)
  }

  select() {
    this.sphere.visible = false
  }
}
