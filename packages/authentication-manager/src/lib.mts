import { jwt } from '@moodlenet/crypto/server'
import assert from 'assert'
import { env } from './init.mjs'
import { shell } from './shell.mjs'
import * as store from './store.mjs'
import type { ClientSession, SessionToken, UserDocument } from './types/sessionTypes.mjs'

export type GetRootSessionTokenResp = { success: boolean }
export async function getRootSessionToken({
  password,
}: {
  password: string
}): Promise<GetRootSessionTokenResp> {
  if (!(env.rootPassword && password)) {
    return { success: false }
  } else if (env.rootPassword === password) {
    const sessionToken = await signClientSession({ isRoot: true })
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
  | { success: true; user: UserDocument; sessionToken: SessionToken }
  | { success: false; msg: string }
> {
  const { pkgId } = shell.assertCallInitiator()
  const user = await store.create({
    providerId: {
      pkgName: pkgId.name,
      uid,
    },
  })
  const sessionToken = await signClientSession({ user })

  return { success: true, user, sessionToken }
}

export async function getSessionToken({ uid }: { uid: string }): Promise<SessionToken | undefined> {
  const { pkgId } = shell.assertCallInitiator()
  const user = await store.getByProviderId({ pkgName: pkgId.name, uid })
  if (!user) {
    return undefined
  }
  const sessionToken = await signClientSession({ user })
  return sessionToken
}

export async function getCurrentClientSession(): Promise<ClientSession | undefined> {
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
  const maybeClientSession = await verifyClientSession(workingAuthToken)

  // console.log({ maybeClientSession })

  if (!maybeClientSession) {
    shell.myAsyncCtx.set(_ => {
      return {
        ..._,
        currentSession: undefined,
      }
    })
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

async function signClientSession(clientSession: ClientSession): Promise<SessionToken> {
  const sessionToken = await jwt.sign(clientSession)
  return sessionToken
}

async function verifyClientSession(token: SessionToken): Promise<ClientSession | null> {
  try {
    const decryptRes = await jwt.verify(token)
    const clientSession = decryptRes.payload
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
