import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import { resolve } from 'path'
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
export type AuthenticationManagerExt = ExtDef<'@moodlenet/authentication-manager', '0.1.0', Topo, void, void>

const ext: Ext<AuthenticationManagerExt, [CoreExt]> = {
  name: '@moodlenet/authentication-manager',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0'],
  wireup(shell) {
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
    return {
      deploy() {
        const store = userStore({ folder: resolve(__dirname, '..', '.ignore', 'users') })
        shell.provide.services({
          async registerUser({ msg }) {
            const { extName } = shell.lib.splitExtId(msg.source)
            const { displayName, uid, avatarUrl } = msg.data.req
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
          async getSessionToken({ msg }) {
            const { extName } = shell.lib.splitExtId(msg.source)
            const { uid } = msg.data.req
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
          async getClientSession({ msg }) {
            const { token } = msg.data.req
            const clientSession = await getClientSession(token)
            if (!clientSession) {
              return { success: false }
            }

            return { success: true, clientSession }
          },
        })

        return

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
