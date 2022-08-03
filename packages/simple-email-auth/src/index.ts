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

export type SimpleEmailAuthExt = ExtDef<'@moodlenet/simple-email-auth', '0.1.0', SimpleEmailAuthTopo, void, void>

const ext: Ext<SimpleEmailAuthExt, [CoreExt, ReactAppExt, EmailService, AuthenticationManagerExt]> = {
  name: '@moodlenet/simple-email-auth',
  version: '0.1.0',
  requires: [
    '@moodlenet/core@0.1.0',
    '@moodlenet/react-app@0.1.0',
    '@moodlenet/email-service@0.1.0',
    '@moodlenet/authentication-manager@0.1.0',
  ],
  wireup(shell) {
    shell.plugin<ReactAppExt>('@moodlenet/react-app@0.1.0', plug => {
      console.log(`@moodlenet/simple-email-auth: onExtInstance<ReactAppExt>`, plug)
      plug.setup({
        ctxProvider: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainProvider.tsx'),
        },
      })
    })

    // qui prende solo post
    shell.expose({
      'login/sub': { validate: () => ({ valid: true }) },
      'signup/sub': { validate: () => ({ valid: true }) },
    })
    return {
      deploy() {
        const store = userStore({ folder: resolve(__dirname, '..', '.ignore', 'userStore') })

        const authMng = shell.access<AuthenticationManagerExt>('@moodlenet/authentication-manager@0.1.0')
        const emailSrv = shell.access<EmailService>('@moodlenet/email-service@0.1.0')

        shell.provide.services({
          async login({
            msg: {
              data: {
                req: { email, password },
              },
            },
          }) {
            const aaa = await emailSrv.fetch('send')({ paramIn1: 'aaa@aaa.com' })
            console.log('xxxxx', aaa.msg.data)
            /*  aaa.then((a)=>{
              throw new Error('xxxxxx')
            }) */

            const user = await store.getByEmail(email)
            if (!user || user.password !== password) {
              return { success: false }
            }
            const {
              msg: { data: res },
            } = await authMng.fetch('getSessionToken')({ uid: user.id })

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

            // manda un email, con link di ritorno, 
            const mUser = await store.getByEmail(email)
            if (mUser) {
              return { success: false, msg: 'email exists' }
            }

            const user = await store.create({ email, password })

            const {
              msg: { data: authRes },
            } = await authMng.fetch('registerUser')({ uid: user.id, displayName })

            if (!authRes.success) {
              await store.delUser(user.id)
              return authRes
            }

            return { success: true }
          },
        })

        return
      },
    }
  },
}

export default ext
