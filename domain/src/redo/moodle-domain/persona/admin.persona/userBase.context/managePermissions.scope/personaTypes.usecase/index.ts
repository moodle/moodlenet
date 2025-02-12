import { searchUsersByText } from './searchUsersByText.endpoint'
declare module '..' {
  interface Scope {
    personaTypes: personaTypes
  }
}
export type personaTypes = moo.persona.usecase<{ searchUsersByText: searchUsersByText }>
export const personaTypes: moo.gate.usecase<personaTypes> = {
  searchUsersByText: searchUsersByText,
}
