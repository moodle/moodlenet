import * as E from 'fp-ts/Either'
import { Error4xx } from '../../../../../../lib'
import { WRONG_CREDENTIALS } from '../consts'
import type * as def from './login.endpoint'

export const login: moo.core.endpoint<def.login> = async (emailLoginForm, { model }) => {
  const {
    items: [existingUser],
  } = await model.userAccount.find.query({ filters: [{ by: 'id', type: 'email', email: emailLoginForm.email }] })

  if (!existingUser) {
    return E.left(WRONG_CREDENTIALS)
  }

  // TODO: mv userAccount check password as userAccount model endpoint
  const { valid } = await model.crypto.hashing.password.verify.query({
    plainPassword: emailLoginForm.password,
    hash: existingUser.password.hash,
  })

  if (!valid) {
    return E.left(WRONG_CREDENTIALS)
  }

  const userId = existingUser.userId
  const e_activeAuthPermissionsInfoObj = await model.accessControl.user.activateNewAuthSession.sync({ userId })
  if (E.isLeft(e_activeAuthPermissionsInfoObj)) {
    throw new Error4xx('Expectation Failed', `Failed to activate auth session for user[${userId}] due to ${e_activeAuthPermissionsInfoObj.left}`)
  }
  const { authSessionToken } = e_activeAuthPermissionsInfoObj.right
  return E.right({ authSessionToken })
}
