import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { WRONG_CREDENTIALS } from '../consts'
import type * as def from './login.endpoint'

export const login: moo.core.endpoint<def.login> = async (emailLoginForm, _) => {
  const existingUser = await _.over(_.model.userAccount.user).one.query({ filters: { emailEquals: emailLoginForm.email } })

  if (O.isNone(existingUser)) {
    return E.left(WRONG_CREDENTIALS)
  }

  const { valid } = await _.over(_.model.crypto.hashing.password.verify).call.query({
    plainPassword: emailLoginForm.password,
    hash: existingUser.value.data.password.hash,
  })

  if (!valid) {
    return E.left(WRONG_CREDENTIALS)
  }

  const userId = existingUser.value.id
  const userSession = await _.over(_.model.accessControl.getSession).call.query(O.some({ userId }))

  return E.right(userSession)
}
