import { ApiCtx, FloorApiCtx, PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import { cryptoPkgApis } from './arangoPkgApis.mjs'
import * as store from './store.mjs'
import { ClientSession, SessionToken } from './types.mjs'

export async function getSessionToken({ uid, pkgId }: { uid: string; pkgId: PkgIdentifier }) {
  const user = await store.getByProviderId({ pkgName: pkgId.name, uid })
  if (!user) {
    return { success: false, msg: 'cannot find user' }
  }
  const sessionToken = await encryptClientSession({ user })
  return { success: true, sessionToken }
}

export async function getClientSession({ token }: { token: string }) {
  const clientSession = await decryptClientSession(token)
  if (!clientSession) {
    return { success: false }
  }

  return { success: true, clientSession }
}

export async function getApiCtxClientSession({ ctx }: { ctx: ApiCtx }) {
  return ctx[`@moodlenet/authentication-manager`]?.clientSession
}

export async function setApiCtxClientSession({ authToken, ctx }: { authToken: string | undefined; ctx: FloorApiCtx }) {
  if (!authToken) {
    return
  }
  const data = await getClientSession({ token: authToken })
  if (!data.success) {
    return
  }
  const { clientSession } = data

  ctx['@moodlenet/authentication-manager'] = { clientSession }
}
export async function encryptClientSession(clientSession: ClientSession): Promise<SessionToken> {
  const { encrypted: sessionToken } = await cryptoPkgApis('std/encrypt')({})({ payload: JSON.stringify(clientSession) })
  return sessionToken
}
async function decryptClientSession(token: SessionToken): Promise<ClientSession | null> {
  try {
    const decryptRes = await cryptoPkgApis('std/decrypt')({})({ encrypted: token })
    assert(decryptRes.valid)
    const clientSession: ClientSession = JSON.parse(decryptRes.payload)
    assert(isClientSession(clientSession))
    return clientSession
  } catch {
    return null
  }
}
function isClientSession(clientSession: any): clientSession is ClientSession {
  // FIXME: implement checks
  return !!clientSession
}
