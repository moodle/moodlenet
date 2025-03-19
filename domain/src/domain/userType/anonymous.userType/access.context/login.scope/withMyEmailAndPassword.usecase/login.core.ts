import * as E from 'fp-ts/Either'
import { Error4xx } from '../../../../../../lib'
import { WRONG_CREDENTIALS } from '../consts'
import type * as def from './login.endpoint'
import { isNone } from 'fp-ts/Option'

export const login: moo.def.core.endpoint<def.login> = async (emailLoginForm, { model }) => {
  const o_existingUser = await model.idConfirmedEmail.findByEmail.query({ email: emailLoginForm.email })

  if (isNone(o_existingUser)) {
    return E.left(WRONG_CREDENTIALS)
  }
  const existingUser = o_existingUser.value

  const { valid } = await model.crypto.hashing.password.verify.query({
    plainPassword: emailLoginForm.password,
    hash: existingUser.password.hash,
  })

  if (!valid) {
    return E.left(WRONG_CREDENTIALS)
  }

  const userId = existingUser.userId
  const e_activeAuthPoliciesInfoObj = await model.accessControl.user.activateNewAuthSession.sync({ userId })
  if (E.isLeft(e_activeAuthPoliciesInfoObj)) {
    throw new Error4xx('Expectation Failed', `Failed to activate auth session for user[${userId}] due to ${e_activeAuthPoliciesInfoObj.left}`)
  }
  const { authSessionToken } = e_activeAuthPoliciesInfoObj.right
  return E.right({ authSessionToken })
}
