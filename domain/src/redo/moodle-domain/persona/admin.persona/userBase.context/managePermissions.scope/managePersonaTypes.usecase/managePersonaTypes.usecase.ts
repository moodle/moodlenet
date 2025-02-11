import { searchUsersByText, searchUsersByText_Gate } from './searchUsersByText.endpoint'

export type managePersonaTypes = moo.persona.usecase<{ searchUsersByText: searchUsersByText }>
export const managePersonaTypes_Gate: moo.gate.usecase<managePersonaTypes> = {
  searchUsersByText: searchUsersByText_Gate,
}
