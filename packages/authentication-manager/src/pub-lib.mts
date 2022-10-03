import { ApiCtx, FloorApiCtx, PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import * as store from './store.mjs'
import { ClientSession, SessionToken } from './types.mjs'
import { cryptoPkgApis } from './use-pkg-apis.mjs'

type GetSessionResp = { success: false; msg: string } | { success: true; sessionToken: SessionToken }
export async function getSessionToken({
  uid,
  pkgId,
}: {
  uid: string
  pkgId: PkgIdentifier<any>
}): Promise<GetSessionResp> {
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
    return { success: false } as const
  }

  return { success: true, clientSession } as const
}

export function getApiCtxClientSession({ ctx }: { ctx: ApiCtx }): ClientSession | undefined {
  return ctx[`@moodlenet/authentication-manager`]?.clientSession
}

export async function setApiCtxClientSession({ token, ctx }: { token: string | undefined; ctx: FloorApiCtx }) {
  if (!token) {
    return
  }
  const data = await getClientSession({ token })
  if (!data.success) {
    return
  }
  const { clientSession } = data

  ctx['@moodlenet/authentication-manager'] = { clientSession }
}

export async function encryptClientSession(clientSession: ClientSession): Promise<SessionToken> {
  const { encrypted: sessionToken } = await cryptoPkgApis('std/encrypt')({ payload: JSON.stringify(clientSession) })
  return sessionToken
}

async function decryptClientSession(token: SessionToken): Promise<ClientSession | null> {
  try {
    const decryptRes = await cryptoPkgApis('std/decrypt')({ encrypted: token })
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
