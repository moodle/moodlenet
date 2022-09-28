import type { MNArangoDBExt } from '@moodlenet/arangodb'
import type { AuthenticationManagerExtDef, SessionToken } from '@moodlenet/authentication-manager'
import type { ContentGraphExtDef } from '@moodlenet/content-graph'
import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { CryptoExt } from '@moodlenet/crypto'
import type { EmailService } from '@moodlenet/email-service'
import type { MNHttpServerExtDef } from '@moodlenet/http-server'
import type { ReactAppExtDef } from '@moodlenet/react-app'
import type { WebUserExtDef } from '@moodlenet/web-user'
import assert from 'assert'
import { resolve } from 'path'
import userStore from './store'
type SignupReq = { email: string; password: string; displayName: string }
type ConfirmEmailPayload = { req: SignupReq }
export type SimpleEmailAuthTopo = {
  login: SubTopo<
    { email: string; password: string },
    { success: true; sessionToken: SessionToken } | { success: false }
  >
  signup: SubTopo<SignupReq, { success: true } | { success: false; msg: string }>
  confirm: SubTopo<{ token: string }, { success: true; sessionToken: SessionToken } | { success: false; msg: string }>
}

export type SimpleEmailAuthExtDef = ExtDef<'@moodlenet/simple-email-auth', '0.1.0', void, SimpleEmailAuthTopo>
export type SimpleEmailAuthExt = Ext<
  SimpleEmailAuthExtDef,
  [
    CoreExt,
    ReactAppExtDef,
    AuthenticationManagerExtDef,
    EmailService,
    MNHttpServerExtDef,
    CryptoExt,
    MNArangoDBExt,
    ContentGraphExtDef,
    WebUserExtDef,
  ]
>

const ext: SimpleEmailAuthExt = {
  name: '@moodlenet/simple-email-auth',
  version: '0.1.0',
  requires: [
    '@moodlenet/core@0.1.0',
    '@moodlenet/react-app@0.1.0',
    '@moodlenet/authentication-manager@0.1.0',
    '@moodlenet/email-service@0.1.0',
    '@moodlenet/http-server@0.1.0',
    '@moodlenet/crypto@0.1.0',
    '@moodlenet/arangodb@0.1.0',
    '@moodlenet/content-graph@0.1.0',
    '@moodlenet/web-user@0.1.0',
  ],
  async connect(shell) {
    const [, reactApp, authMng, emailSrv, http, crypto, arangopkg, contentGraph, profile] = shell.deps
    reactApp.plug.setup({
      mainComponentLoc: resolve(__dirname, '..', 'src', 'webapp', 'MainModule.tsx'),
    })
    await arangopkg.access.fetch('ensureCollections')({ defs: { User: { kind: 'node' } } })

    return {
      deploy() {
        http.plug.mount({ getApp: getHttpApp })
        shell.expose({
          'login/sub': { validate: () => ({ valid: true }) },
          'signup/sub': { validate: () => ({ valid: true }) },
          'confirm/sub': { validate: () => ({ valid: true }) },
        })

        const store = userStore({ shell })
        shell.provide.services({
          async login({ email, password }) {
            const user = await store.getByEmail(email)
            if (!user || user.password !== password) {
              return { success: false }
            }
            const {
              msg: { data: res },
            } = await authMng.access.fetch('getSessionToken')({ uid: user.id })

            if (!res.success) {
              return { success: false }
            }
            const sessionToken = res.sessionToken
            return { success: true, sessionToken }
          },
          async signup(req) {
            const mUser = await store.getByEmail(req.email)

            if (mUser) {
              return { success: false, msg: 'email exists' }
            }

            const confirmEmailPayload: ConfirmEmailPayload = {
              req,
            }
            const {
              msg: {
                data: { encrypted: confirmEmailToken },
              },
            } = await crypto.access.fetch('encrypt')({ payload: JSON.stringify(confirmEmailPayload) })
            emailSrv.access.fetch('send')({
              emailObj: {
                to: req.email,
                text: `hey ${req.displayName} confirm your email with /_/@moodlenet/simple-email-auth/confirm-email/${confirmEmailToken}`,
              },
            })
            return { success: true }
          },
          async confirm({ token }) {
            const confirmEmailPayload = await getConfirmEmailPayload()
            if (!confirmEmailPayload) {
              return { success: false, msg: `invalid confirm token` }
            }
            const {
              req: { displayName, email, password },
            } = confirmEmailPayload

            const mUser = await store.getByEmail(email)

            if (mUser) {
              return { success: false, msg: 'user registered' }
            }

            const user = await store.create({ email, password })

            const {
              msg: { data: authRes },
            } = await authMng.access.fetch('registerUser')({ uid: user.id, displayName })

            if (!authRes.success) {
              await store.delUser(user.id)
              const { msg, success } = authRes
              return { msg, success }
            }

            /*  const profileNodeResp = */ await contentGraph.plug.createNode(
              profile.plug.glyphDescriptors.Profile,
              { title: displayName, description: '' },
              { authenticableBy: { userId: authRes.user.id } },
            )

            const { sessionToken } = authRes
            return { success: true, sessionToken }
            async function getConfirmEmailPayload() {
              const {
                msg: { data: decryptRes },
              } = await crypto.access.fetch('decrypt')({ encrypted: token })

              try {
                assert(decryptRes.valid)

                const confirmEmailPayload = JSON.parse(decryptRes.payload)
                assert(isConfirmEmailPayload(confirmEmailPayload))
                return confirmEmailPayload
              } catch {
                return undefined
              }
            }
          },
        })
        return {}
        function getHttpApp() {
          const app = http.plug.express()
          app.get('/confirm-email/:token', async (req, res) => {
            const { token } = req.params
            const {
              msg: { data: confirmResp },
            } = await shell.me.fetch('confirm')({ token })

            if (!confirmResp.success) {
              res.status(400).end(confirmResp.msg)
              return
            }
            res.redirect(`/@moodlenet/simple-email-auth/confirm-email?sessionToken=${confirmResp.sessionToken}`)
          })
          return app
        }
      },
    }
  },
}

export default ext
function isConfirmEmailPayload(_: any): _ is ConfirmEmailPayload {
  //FIXME: implement checks
  return !!_
}
