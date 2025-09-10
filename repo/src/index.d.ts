declare module '@tris3d/repo' {
  export function ensureDir(dir: string): Promise<void>

  export function isMainModule(modulePath: string): Promise<void>

  export function openBrowser({ port }: { port: number }): void

  export const workspaceDir: Record<string, string>
}
