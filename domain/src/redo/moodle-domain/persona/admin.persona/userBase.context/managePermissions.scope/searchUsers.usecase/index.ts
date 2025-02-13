import { byText } from './byText.endpoint'
declare module '..' {
  interface Scope {
    searchUsers: searchUsers
  }
}
export type searchUsers = moo.persona.usecase<{ byText: byText }>
export const searchUsers: moo.gate.usecase<searchUsers> = {
  byText,
}
