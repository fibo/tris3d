declare module '@tris3d/i18n' {
  export function translate (lang: string): {
    action(key: string): string;
    playmode(key: string): string;
    rooms: string;
  }
}
