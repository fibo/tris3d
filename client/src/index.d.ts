import { I18nController } from '@tris3d/i18n';

declare module '@tris3d/client' {
  export const i18n: I18nController;
  export class StateController {}
}
