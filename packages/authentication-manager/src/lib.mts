import { PkgIdentifier } from '@moodlenet/core'
import { env } from './env.mjs'
import { encryptClientSession } from './pub-lib.mjs'
import * as store from './store.mjs'
import { SessionToken, User } from './types.mjs'

export type GetRootSessionTokenResp =
  | { success: false }
  | { success: true; sessionToken: SessionToken }
export async function getRootSessionToken({
  password,
}: {
  password: string
}): Promise<GetRootSessionTokenResp> {
  if (!(env.rootPassword && password)) {
    return { success: false }
  } else if (env.rootPassword === password) {
    const sessionToken = await encryptClientSession({ root: true })
    return { success: true, sessionToken }
  } else {
    return { success: false }
  }
}

export async function registerUser({
  uid,
  pkgId,
}: {
  uid: string
  pkgId: PkgIdentifier
}): Promise<
  { success: true; user: User; sessionToken: SessionToken } | { success: false; msg: string }
> {
  const user = await store.create({
    providerId: {
      pkgName: pkgId.name,
      uid,
    },
  })
  const sessionToken = await encryptClientSession({ user })

  return { success: true, user, sessionToken }
}
