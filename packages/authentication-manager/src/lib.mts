import { shell } from './shell.mjs'
import * as store from './store.mjs'
import { UserDocument } from './types.mjs'

export async function registerUser({
  uid,
}: {
  uid: string
}): Promise<{ success: true; user: UserDocument } | { success: false; msg: string }> {
  const { pkgId } = shell.assertCallInitiator()
  const user = await store.create({
    providerId: {
      pkgName: pkgId.name,
      uid,
    },
  })

  return { success: true, user }
}
