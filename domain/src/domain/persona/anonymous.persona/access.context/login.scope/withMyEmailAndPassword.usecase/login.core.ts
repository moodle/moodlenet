import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { WRONG_CREDENTIALS } from '../consts'
import type * as def from './login.endpoint'
import { Error4xx } from '../../../../../../lib'

export const login: moo.core.endpoint<def.login> = async (emailLoginForm, _) => {
  const existingUser = await _.over(_.model.userAccount.userAccountSpace).one.query({ filters: { emailEquals: emailLoginForm.email } })

  if (O.isNone(existingUser)) {
    return E.left(WRONG_CREDENTIALS)
  }

  // TODO: mv userAccount check password as userAccount model endpoint
  const { valid } = await _.over(_.model.crypto.hashing.password.verify).call.query({
    plainPassword: emailLoginForm.password,
    hash: existingUser.value.data.password.hash,
  })

  if (!valid) {
    return E.left(WRONG_CREDENTIALS)
  }

  const userId = existingUser.value.id
  const e_activeAuthPermissionsInfoObj = await _.over(_.model.accessControl.user[userId]?.activateNewAuthSession).call.sync()
  if (E.isLeft(e_activeAuthPermissionsInfoObj)) {
    throw new Error4xx('Expectation Failed', `Failed to activate auth session for user[${userId}] due to ${e_activeAuthPermissionsInfoObj.left}`)
  }
  const { authSessionToken } = e_activeAuthPermissionsInfoObj.right
  return E.right({ authSessionToken })
}
