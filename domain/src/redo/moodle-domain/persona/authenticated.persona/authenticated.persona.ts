import { myAccount, myAccount_Gate } from './myAccount.context/myAccount.context'

export type authenticated = moo.persona<{
  myAccount: myAccount
  [moo.persona.context]: { userId: string }
}>

export const authenticated_Gate: moo.gate.persona<authenticated> = {
  myAccount: myAccount_Gate,
}
