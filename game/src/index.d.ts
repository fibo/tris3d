declare module '@tris3d/game' {
  export class GameBoard {
  }

  export class GameRoom {
    constructor(id: string);
  }

  // space.js
  export const POSITIONS: string[];
  export const VECTOR_OF_POSITION: Record<string, [number, number, number]>;
}
