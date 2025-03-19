import { resetMyPassword } from './resetMyPassword.usecase/resetMyPassword.usecase'
import { withMyEmailAndPassword } from './withMyEmailAndPassword.usecase/withMyEmailAndPassword.usecase'

export interface Login {
  withMyEmailAndPassword: withMyEmailAndPassword
  resetMyPassword: resetMyPassword
}

export type login = moo.def.userType.scope<moo<Login>>
export const login: moo.def.gate.provider.scope<login> = {
  withMyEmailAndPassword,
  resetMyPassword,
}
