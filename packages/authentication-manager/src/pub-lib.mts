import type { PkgIdentifier } from '@moodlenet/core'
import { std } from '@moodlenet/crypto'
import assert from 'assert'
import shell from './shell.mjs'
import * as store from './store.mjs'
import { ClientSession, SessionToken } from './types.mjs'

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

export async function getApiCtxClientSession(): Promise<ClientSession | void> {
  const ctx = shell.myAsyncCtx.get()
  if (!ctx) {
    return
  }
  if (ctx.type === 'client-session-fetched') {
    return ctx.clientSession
  }

  const data = await getClientSession({ token: ctx.authToken })

  if (!data.success) {
    // FIXME: SHALL? shell.myAsyncCtx.unset()
    return
  }

  const { clientSession } = data

  shell.myAsyncCtx.set(() => ({
    type: 'client-session-fetched',
    authToken: ctx.authToken,
    clientSession,
  }))

  return clientSession
}

export async function setApiCtxClientSessionToken({ token }: { token: string | undefined }) {
  if (!token) {
    shell.myAsyncCtx.unset()
    return
  }

  shell.myAsyncCtx.set(() => ({
    type: 'auth-token-set',
    authToken: token,
  }))
}

export async function encryptClientSession(clientSession: ClientSession): Promise<SessionToken> {
  const { encrypted: sessionToken } = await std.encrypt({
    payload: JSON.stringify(clientSession),
  })
  return sessionToken
}

async function decryptClientSession(token: SessionToken): Promise<ClientSession | null> {
  try {
    const decryptRes = await std.decrypt({ encrypted: token })
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
