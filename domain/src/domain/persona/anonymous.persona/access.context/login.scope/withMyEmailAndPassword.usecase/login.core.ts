import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { WRONG_CREDENTIALS } from '../consts'
import type * as def from './login.endpoint'
import { Error4xx } from '../../../../../../lib'

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
  const e_activeAuthSessionInfoObj = await _.over(_.model.accessControl.activateAuthSessionFor).call.query({ userId })
  if (E.isLeft(e_activeAuthSessionInfoObj)) {
    throw new Error4xx('Expectation Failed', `Failed to activate auth session for user[${userId}] due to ${e_activeAuthSessionInfoObj.left}`)
  }
  const { activeAuthSessionInfo } = e_activeAuthSessionInfoObj.right
  return E.right({ activeAuthSessionInfo })
}
