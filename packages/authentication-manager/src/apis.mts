import { defApi } from '@moodlenet/core'
import { getClientSession, getRootSessionToken, getSessionToken, registerUser } from './lib.mjs'

export default {
  registerUser: defApi(
    ctx =>
      ({ uid }: { uid: string }) => {
        return registerUser({ pkgId: ctx.caller.pkgInfo.pkgId, uid })
      },
    () => true,
  ),

  getSessionToken: defApi(
    ctx =>
      ({ uid }: { uid: string }) => {
        return getSessionToken({ pkgId: ctx.caller.pkgInfo.pkgId, uid })
      },
    () => true,
  ),

  getRootSessionToken: defApi(
    _ctx =>
      ({ password }: { password: string }) => {
        return getRootSessionToken({ password })
      },
    () => true,
  ),

  getClientSession: defApi(
    _ctx =>
      ({ token }: { token: string }) => {
        return getClientSession({ token })
      },
    () => true,
  ),
}
