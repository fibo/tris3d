import { translate } from '@tris3d/i18n';

declare module '@tris3d/client' {
  export const i18n: {
    translate: (key: string) => string;
  }
  export class StateController {}
}
