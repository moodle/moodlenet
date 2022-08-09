import type { MNArangoDBExt } from '@moodlenet/arangodb'
import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import userStore from './store'
import { User, UserData } from './store/types'
import { ClientSession, SessionToken } from './types'
export * from './types'

export type Topo = {
  registerUser: SubTopo<
    { uid: string; displayName: string; avatarUrl?: string },
    { success: true; user: User; sessionToken: SessionToken } | { success: false; msg: string }
  >
  getSessionToken: SubTopo<
    { uid: string },
    { success: true; sessionToken: SessionToken } | { success: false; msg: string }
  >
  getClientSession: SubTopo<{ token: string }, { success: true; clientSession: ClientSession } | { success: false }>
}

export type AuthenticationManagerExt = ExtDef<'@moodlenet/authentication-manager', '0.1.0', void, Topo>

const ext: Ext<AuthenticationManagerExt, [CoreExt, MNArangoDBExt]> = {
  name: '@moodlenet/authentication-manager',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/arangodb@0.1.0'],
  connect(shell) {
    const [, arangopkg] = shell.deps
    return {
      async install() {
        await arangopkg.plug.createDocumentCollections([{ name: 'User' }])
      },
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
        })

        const store = userStore({ shell })

        shell.provide.services({
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
            const sessionToken = await createSessionToken(user)

            return { success: true, user, sessionToken }
          },
          async getSessionToken({ uid }, { source }) {
            const { extName } = shell.lib.splitExtId(source)
            const user = await store.getByProviderId({
              ext: extName,
              uid,
            })
            if (!user) {
              return { success: false, msg: 'cannot find user' }
            }
            const sessionToken = await createSessionToken(user)
            return { success: true, sessionToken }
          },
          async getClientSession({ token }) {
            const clientSession = await getClientSession(token)
            if (!clientSession) {
              return { success: false }
            }

            return { success: true, clientSession }
          },
        })

        return {}

        async function createSessionToken(user: User): Promise<SessionToken> {
          const userData: UserData = user
          const sessionToken: SessionToken = JSON.stringify(userData)

          return sessionToken
        }
        async function getClientSession(token: SessionToken): Promise<ClientSession | null> {
          try {
            const userData: UserData = JSON.parse(token)
            const clientSession: ClientSession = {
              user: userData,
            }
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
