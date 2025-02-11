import {
  resetMyPassword,
  resetMyPassword_Gate,
} from '../../../anonymous.persona/access.context/login.scope/resetMyPassword.usecase/resetMyPassword.usecase'
import { deleteIt, deleteMyAccount_Gate } from './deleteIt.usecase/deleteIt.usecase'

export type manage = moo.persona.scope<{ resetMyPassword: resetMyPassword; deleteIt: deleteIt }>

export const manage_Gate: moo.gate.scope<manage> = {
  resetMyPassword: resetMyPassword_Gate,
  deleteIt: deleteMyAccount_Gate,
}
