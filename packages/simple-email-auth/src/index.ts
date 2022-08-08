import type { AuthenticationManagerExt, SessionToken } from '@moodlenet/authentication-manager'
import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { EmailService } from '@moodlenet/email-service'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import type { ReactAppExt } from '@moodlenet/react-app'
import { resolve } from 'path'
import { prepareApp } from './middleware/express/app'
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
  confirm: SubTopo<
  { },
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
  deploy(shell) {
    shell.plugin<ReactAppExt>('@moodlenet/react-app@0.1.0', plug => {
      console.log(`@moodlenet/simple-email-auth: onExtInstance<ReactAppExt>`, plug)
      plug.setup({
        ctxProvider: {
          moduleLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainProvider.tsx'),
        },
      })
    })

    shell.plugin<MNHttpServerExt>('@moodlenet/http-server@0.1.0', plug => {
      // qui chiede al plugin di montare una route 
      // get app ritorna express app 
      // come dire , montami quesdta app sul route, con link ocon underscore , nome pluign ecc
      plug.mount({ getApp })
      function getApp() {
        const app = plug.express()
        app.get('pippo', ()=>{
          return console.log()
        }) // aggiungo 

        prepareApp(shell, app)
        return app
      }
    })


    // qui prende solo post
    // se arriva dal esterno , decide se lo faccio o no,
    // qualsiasi chiamata tramite http o servizio simile expose è generico
    // fa la validazione.

    shell.expose({
      'login/sub': { validate: () => ({ valid: true }) },
      'signup/sub': { validate: () => ({ valid: true }) }
    })

    const store = userStore({ folder: resolve(__dirname, '..', '.ignore', 'userStore') })

    const authMng = shell.access<AuthenticationManagerExt>('@moodlenet/authentication-manager@0.1.0')
    const emailSrv = shell.access<EmailService>('@moodlenet/email-service@0.1.0')

    const httpServer = shell.access<EmailService>('@moodlenet/http-server@0.1.0')
 

    shell.provide.services({
      async login({
        msg: {
          data: {
            req: { email, password },
          },
        },
      }) {
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
        
        const mUser = await store.getByEmail(email)
        if (mUser) {
          return { success: false, msg: 'email exists' }
        }

        const user = await store.create({ email, password })

          // manda un email, con link di ritorno,
          const aaa = await emailSrv.fetch('send')({ paramIn1: 'aaa@aaa.com' })
          console.log('xxxxx', aaa.msg.data)

        const {
          msg: { data: authRes },
        } = await authMng.fetch('registerUser')({ uid: user.id, displayName })

        if (!authRes.success) {
          await store.delUser(user.id)
          return authRes
        }

        return { success: true }
      },
      async confirm({
        msg: {
        data: {
          req: { },
        },
      },}){
        return {success:true}
      }
    })

    return {}
  },
}

export default ext
