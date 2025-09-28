import { playerColor } from '@tris3d/game'

export const color = {
  white: 0xffffff,
  silver: 0xc0c0c0,
}

for (const [colorName, { hex }] of Object.entries(playerColor))
  color[colorName] = hex
