declare module '@tris3d/game' {
  export class GameBoard {
    readonly gameIsOver: boolean;
    readonly hasWinner: boolean;
    readonly isTie: boolean;
  }

  export class GameRoom {
    constructor(id: string);
  }

  // AI.js
  export const AI = {
    stupid: (moves: string[]) => string,
    smart: (moves: string[]) => string,
    bastard: (moves: string[], targetPlayerIndex?: number) => string,
  }

  // players.js
  export const defaultPlayerColors: string[];
  export const playerColor: Record<string, {
    hex: number;
    str: string;
  }>;

  // space.js
  export const POSITIONS: string[];
  export const VECTOR_OF_POSITION: Record<string, [number, number, number]>;
}
