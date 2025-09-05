declare module '@tris3d/game' {
  export class GameBoard {}

  export class GameRoom {
    constructor(id: string);
  }

  // pubsub.js
  export function peek(key: string): unknown;
  export function publish(key: string, arg: unknown): void;
  export function subscribe(key: string, callback: (value: unknown) => void): () => void;

  // space.js
  export const POSITIONS: string[];
  export const VECTOR_OF_POSITION: Record<string, [number, number, number]>;
}
