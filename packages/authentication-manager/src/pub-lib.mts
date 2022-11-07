import { ApiCtx, FloorApiCtx, PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import * as store from './store.mjs'
import { ClientSession, SessionToken } from './types.mjs'
import { cryptoPkg } from './use-pkg-apis.mjs'

type GetSessionResp =
  | { success: false; msg: string }
  | { success: true; sessionToken: SessionToken }
export async function getSessionToken({
  uid,
  pkgId,
}: {
  uid: string
  pkgId: PkgIdentifier
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

export async function getApiCtxClientSession({
  ctx,
}: {
  ctx: ApiCtx
}): Promise<ClientSession | undefined> {
  ctx['@moodlenet/authentication-manager'] = ctx['@moodlenet/authentication-manager'] ?? {}
  const presentClientSession = ctx['@moodlenet/authentication-manager'].clientSession
  if (presentClientSession) {
    return presentClientSession
  }

  const token = ctx['@moodlenet/authentication-manager']?.token
  if (!token) {
    return undefined
  }

  const data = await getClientSession({ token })

  if (!data.success) {
    return
  }
  const { clientSession } = data

  ctx['@moodlenet/authentication-manager'].clientSession = clientSession

  return clientSession
}

export async function setApiCtxClientSessionToken({
  token,
  ctx,
}: {
  token: string | undefined
  ctx: FloorApiCtx
}) {
  ctx['@moodlenet/authentication-manager'] = ctx['@moodlenet/authentication-manager'] ?? {}
  if (!token) {
    return
  }

  ctx['@moodlenet/authentication-manager'].token = token
  // console.log({ token, ctx })
  // console.log({ ctx })
}

export async function encryptClientSession(clientSession: ClientSession): Promise<SessionToken> {
  const { encrypted: sessionToken } = await cryptoPkg.api('std/encrypt')({
    payload: JSON.stringify(clientSession),
  })
  return sessionToken
}

async function decryptClientSession(token: SessionToken): Promise<ClientSession | null> {
  try {
    const decryptRes = await cryptoPkg.api('std/decrypt')({ encrypted: token })
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
