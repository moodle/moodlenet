import type { MNArangoDBExt } from '@moodlenet/arangodb'
import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import { CryptoExt } from '@moodlenet/crypto'
import assert from 'assert'
import userStore from './store'
import { User } from './store/types'
import { ClientSession, SessionToken } from './types'
export * from './types'

export type Topo = {
  registerUser: SubTopo<
    { uid: string; displayName: string; avatarUrl?: string },
    { success: true; user: User; sessionToken: SessionToken } | { success: false; msg: string }
  >
  getSessionToken: SubTopo<{ uid: string }, { success: true; sessionToken: SessionToken } | { success: false }>
  getRootSessionToken: SubTopo<{ password: string }, { success: true; sessionToken: SessionToken } | { success: false }>
  getClientSession: SubTopo<{ token: string }, { success: true; clientSession: ClientSession } | { success: false }>
}

export type AuthenticationManagerExt = ExtDef<'@moodlenet/authentication-manager', '0.1.0', void, Topo>

export type ExtAuthenticationManager = Ext<AuthenticationManagerExt, [CoreExt, MNArangoDBExt, CryptoExt]>
const ext: ExtAuthenticationManager = {
  name: '@moodlenet/authentication-manager',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/arangodb@0.1.0', '@moodlenet/crypto@0.1.0'],
  async connect(shell) {
    const [, arangopkg, crypto] = shell.deps
    const env = getEnv(shell.env)

    await arangopkg.access.fetch('ensureDocumentCollections')({ defs: [{ name: 'User' }] })

    return {
      // async install() {
      //   await arangopkg.plug.ensureDocumentCollections([{ name: 'User' }])
      // },
      deploy() {
        shell.expose({
          'getSessionToken/sub': {
            validate() {
              return { valid: true }
            },
          },
          'getClientSession/sub': {
            validate() {
              return { valid: true }
            },
          },
          'getRootSessionToken/sub': {
            validate() {
              return { valid: true }
            },
          },
        })

        const store = userStore({ shell })

        shell.provide.services({
          async getRootSessionToken({ password }) {
            if (!(env.rootPassword && password)) {
              return { success: false }
            } else if (env.rootPassword === password) {
              const sessionToken = await encryptClientSession({ root: true })
              return { success: true, sessionToken }
            } else {
              return { success: false }
            }
          },
          async registerUser({ displayName, uid, avatarUrl }, { source }) {
            const { extName } = shell.lib.splitExtId(source)
            const user = await store.create({
              displayName,
              providerId: {
                ext: extName,
                uid,
              },
              avatarUrl,
            })
            const sessionToken = await encryptClientSession({ user })

            return { success: true, user, sessionToken }
          },
          async getSessionToken({ uid }, { source }) {
            const { extName } = shell.lib.splitExtId(source)
            const user = await store.getByProviderId({ ext: extName, uid })
            if (!user) {
              return { success: false, msg: 'cannot find user' }
            }
            const sessionToken = await encryptClientSession({ user })
            return { success: true, sessionToken }
          },
          async getClientSession({ token }) {
            const clientSession = await decryptClientSession(token)
            if (!clientSession) {
              return { success: false }
            }

            return { success: true, clientSession }
          },
        })

        return {}

        async function encryptClientSession(clientSession: ClientSession): Promise<SessionToken> {
          const {
            msg: {
              data: { encrypted: sessionToken },
            },
          } = await crypto.access.fetch('encrypt')({ payload: JSON.stringify(clientSession) })
          return sessionToken
        }
        async function decryptClientSession(token: SessionToken): Promise<ClientSession | null> {
          try {
            const {
              msg: { data: decryptRes },
            } = await crypto.access.fetch('decrypt')({ encrypted: token })
            assert(decryptRes.valid)
            const clientSession: ClientSession = JSON.parse(decryptRes.payload)
            assert(isClientSession(clientSession))
            return clientSession
          } catch {
            return null
          }
        }
      },
    }
  },
}
export default ext
function isClientSession(clientSession: any): clientSession is ClientSession {
  // FIXME: implement checks
  return !!clientSession
}

export type Env = { rootPassword?: string }
function getEnv(_: any): Env {
  const rootPassword = typeof _?.rootPassword === 'string' ? String(_.rootPassword) : undefined
  return {
    rootPassword,
  }
}
