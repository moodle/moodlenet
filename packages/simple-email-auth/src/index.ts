import type { AuthenticationManagerExt, SessionToken } from '@moodlenet/authentication-manager'
import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { EmailService } from '@moodlenet/email-service'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import userStore from './store'

export type SimpleEmailAuthTopo = {
  login: SubTopo<
    { email: string; password: string },
    { success: true; sessionToken: SessionToken } | { success: false }
  >
  signup: SubTopo<
    { email: string; password: string; displayName: string },
    { success: true } | { success: false; msg: string }
  >
}

export type SimpleEmailAuthExt = ExtDef<'moodlenet-simple-email-auth', '0.1.10', SimpleEmailAuthTopo>

const ext: Ext<SimpleEmailAuthExt, [CoreExt, ReactAppExt, EmailService]> = {
  id: 'moodlenet-simple-email-auth@0.1.10',
  displayName: 'Email authentication',
  description: 'Basic authentication using an email and a password',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10', 'moodlenet-email-service@0.1.10'],
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


            const aaa = await shell.lib.fetch<EmailService>(shell)(
              'moodlenet-email-service@0.1.10::send',
            )({ paramIn1:'aaa@aaa.com' })
       console.log('xxxxx', aaa.msg.data);
          /*  aaa.then((a)=>{
              throw new Error('xxxxxx')
            }) */



            const user = await store.getByEmail(email)
            if (!user || user.password !== password) {
              return { success: false }
            }
            const {
              msg: { data: res },
            } = await shell.lib.fetch<AuthenticationManagerExt>(shell)(
              'moodlenet-authentication-manager@0.1.10::getSessionToken',
            )({ uid: user.id })

            if (!res.success) {
              return { success: false }
            }
            const sessionToken = res.sessionToken
            return { success: true, sessionToken }
          },
          async signup({
            msg: {
              data: {
                req: { email, password, displayName },
              },
            },
          }) {
            const mUser = await store.getByEmail(email)
            if (mUser) {
              return { success: false, msg: 'email exists' }
            }

            const user = await store.create({ email, password })

            const {
              msg: { data: authRes },
            } = await shell.lib.fetch<AuthenticationManagerExt>(shell)(
              'moodlenet-authentication-manager@0.1.10::registerUser',
            )({ uid: user.id, displayName })

            if (!authRes.success) {
              await store.delUser(user.id)
              return authRes
            }

            return { success: true }
          },
        })
        return {}
      },
    }
  },
}

export default { exts: [ext] }
