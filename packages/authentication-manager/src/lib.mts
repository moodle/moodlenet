import { std } from '@moodlenet/crypto'
import assert from 'assert'
import { env } from './env.mjs'
import shell from './shell.mjs'
import * as store from './store.mjs'
import type { ClientSession, SessionToken, User } from './types.mjs'

export type GetRootSessionTokenResp = { success: boolean }
export async function getRootSessionToken({
  password,
}: {
  password: string
}): Promise<GetRootSessionTokenResp> {
  if (!(env.rootPassword && password)) {
    return { success: false }
  } else if (env.rootPassword === password) {
    const sessionToken = await encryptClientSession({ isRoot: true })
    setCurrentClientSessionToken(sessionToken)
    return { success: true }
  } else {
    return { success: false }
  }
}

export async function registerUser({
  uid,
}: {
  uid: string
}): Promise<
  { success: true; user: User; sessionToken: SessionToken } | { success: false; msg: string }
> {
  const { pkgId } = shell.assertCallInitiator()
  const user = await store.create({
    providerId: {
      pkgName: pkgId.name,
      uid,
    },
  })
  const sessionToken = await encryptClientSession({ user })

  return { success: true, user, sessionToken }
}

export async function getSessionToken({ uid }: { uid: string }): Promise<SessionToken | undefined> {
  const { pkgId } = shell.assertCallInitiator()
  const user = await store.getByProviderId({ pkgName: pkgId.name, uid })
  if (!user) {
    return undefined
  }
  const sessionToken = await encryptClientSession({ user })
  return sessionToken
}

export async function getCurrentClientSession(): Promise<ClientSession | void> {
  const workingCtx = shell.myAsyncCtx.get()
  // console.log({ workingCtx })
  if (!workingCtx?.currentSession) {
    return
  }
  // console.log({ currentSession: workingCtx?.currentSession })

  if (workingCtx.currentSession.type === 'client-session-fetched') {
    return workingCtx.currentSession.clientSession
  }

  const workingAuthToken = workingCtx.currentSession.authToken
  const maybeClientSession = await decryptClientSession(workingAuthToken)

  // console.log({ maybeClientSession })

  if (!maybeClientSession) {
    // FIXME: SHALL? shell.myAsyncCtx.unset()
    return
  }
  const workingClientSession = maybeClientSession

  shell.myAsyncCtx.set(editCurrentSession => ({
    ...editCurrentSession,
    currentSession: {
      type: 'client-session-fetched',
      authToken: workingAuthToken,
      clientSession: workingClientSession,
    },
  }))

  return workingClientSession
}

export async function getCurrentClientSessionToken(): Promise<string | void> {
  const workingCtx = shell.myAsyncCtx.get()
  return workingCtx?.currentSession?.authToken
}

export async function setCurrentClientSessionToken(token: string | undefined) {
  if (!token) {
    shell.myAsyncCtx.set(current => ({ ...current, currentSession: undefined }))
    return
  }

  shell.myAsyncCtx.set(current => ({
    ...current,
    currentSession: {
      type: 'auth-token-set',
      authToken: token,
    },
  }))
}

async function encryptClientSession(clientSession: ClientSession): Promise<SessionToken> {
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

function isClientSession(clientSession: unknown): clientSession is ClientSession {
  // FIXME: implement checks
  return !!clientSession
}
