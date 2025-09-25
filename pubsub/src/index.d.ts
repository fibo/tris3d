declare module '@tris3d/pubsub' {
  export function publish(key: string, arg: unknown): void;

  export function subscribe(
    key: string,
    callback: (
      value: unknown,
      get: (key: string) => unknown,
    ) => void
  ): () => void;
}
