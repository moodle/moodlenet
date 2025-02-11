import { changeMyPassword, changeMyPassword_Gate } from './changeMyPassword.endopoint'

export type authentication = moo.persona.usecase<{ changeMyPassword: changeMyPassword }>

export const authentication_Gate: moo.gate.usecase<authentication> = {
  changeMyPassword: changeMyPassword_Gate,
}
