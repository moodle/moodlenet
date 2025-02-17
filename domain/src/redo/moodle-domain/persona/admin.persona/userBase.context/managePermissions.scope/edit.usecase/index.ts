import { role } from './role.endpoint'
declare module '..' {
  interface Scope {
    edit: edit
  }
}
export type edit = moo.persona.usecase<{ role: role }>
export const edit: moo.gate.provider.usecase<edit> = {
  role,
}
