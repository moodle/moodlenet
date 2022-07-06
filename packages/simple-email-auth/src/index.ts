import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import userStore from './store'
import { User } from './store/types'

export type SimpleEmailAuthTopo = {
  login: SubTopo<{ email: string; password: string }, { success: true } | { success: false }>
  signup: SubTopo<
    { email: string; password: string; displayName: string },
    { success: true; user: User } | { success: false; msg: string }
  >
}

export type SimpleEmailAuthExt = ExtDef<'moodlenet-simple-email-auth', '0.1.10', SimpleEmailAuthTopo>

const ext: Ext<SimpleEmailAuthExt, [CoreExt, ReactAppExt]> = {
  id: 'moodlenet-simple-email-auth@0.1.10',
  displayName: 'simple email auth ext',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
  enable(shell) {
    shell.onExtInstance<ReactAppExt>('moodlenet.react-app@0.1.10', inst => {
      console.log(`moodlenet-simple-email-auth: onExtInstance<ReactAppExt>`, inst)
      inst.setup({
        ctxProvider: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainProvider.tsx'),
        },
      })
    })
    shell.expose({
      'login/sub': { validate: () => ({ valid: true }) },
      'signup/sub': { validate: () => ({ valid: true }) },
    })
    return {
      deploy() {
        const store = userStore({ folder: resolve(__dirname, '..', '.ignore', 'userStore') })
        shell.lib.pubAll<SimpleEmailAuthExt>('moodlenet-simple-email-auth@0.1.10', shell, {
          async login({
            msg: {
              data: {
                req: { email, password },
              },
            },
          }) {
            const mUser = await store.getByEmail(email)
            if (!mUser || mUser.password !== password) {
              return { success: false }
            }
            return { success: true }
          },
          async signup({
            msg: {
              data: {
                req: { email, password /* , displayName */ },
              },
            },
          }) {
            const mUser = await store.getByEmail(email)
            if (mUser) {
              return { success: false, msg: 'email exists' }
            }
            const user = await store.create({ email, password })

            return { success: true, user }
          },
        })
        return {}
      },
    }
  },
}

export default { exts: [ext] }
