import { PkgIdentifier } from '@moodlenet/core'
import { env } from './init.mjs'
import { encryptClientSession } from './pub-lib.mjs'
import * as store from './store.mjs'

export async function getRootSessionToken({ password }: { password: string }) {
  if (!(env.rootPassword && password)) {
    return { success: false }
  } else if (env.rootPassword === password) {
    const sessionToken = await encryptClientSession({ root: true })
    return { success: true, sessionToken }
  } else {
    return { success: false }
  }
}

export async function registerUser({ uid, pkgId }: { uid: string; pkgId: PkgIdentifier }) {
  const user = await store.create({
    providerId: {
      pkgName: pkgId.name,
      uid,
    },
  })
  const sessionToken = await encryptClientSession({ user })

  return { success: true, user, sessionToken }
}
