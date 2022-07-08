// import csrf from 'csurf'
import type { AuthenticationManagerExt } from '@moodlenet/authentication-manager'
import { Shell } from '@moodlenet/core'
import type { Express } from 'express'
import { SocialAuthExt } from '..'
import { getAuthMngUidByOauthResult } from './lib'
import getPassport from './passport'

export function prepareApp(shell: Shell<SocialAuthExt>, app: Express) {
  const passport = getPassport()

  // app.use(csrf())
  app.get('/login/federated/:providerName', (req, res, next) =>
    passport.authenticate(req.params.providerName, { session: false })(req, res, next),
  )

  app.get('/oauth2/redirect/:providerName', (req, res, next) =>
    passport.authenticate(req.params.providerName, {
      session: false,
    })(req, res, next),
  )

  app.get('/oauth2/redirect/:providerName', async (req, res) => {
    // console.log('***', req.params.providerName, inspect(req.user, false, 10, true))
    if (!req.user) {
      res.redirect(`/moodlenet-passport-auth/login-fail?msg=couldn't authenticate`)
      return
    }
    const authSrv = shell.lib.subDemat<AuthenticationManagerExt>(shell)
    const uid = getAuthMngUidByOauthResult(req.user.oauth)
    const {
      msg: { data: getTokenData },
    } = await shell.lib.rx.firstValueFrom(
      authSrv('moodlenet-authentication-manager@0.1.10::getSessionToken')({
        uid,
      }),
    )
    let token: string
    if (!getTokenData.success) {
      const {
        msg: { data: createUserRes },
      } = await shell.lib.rx.firstValueFrom(
        authSrv('moodlenet-authentication-manager@0.1.10::registerUser')({
          uid,
          displayName: req.user.oauth.profile.displayName,
        }),
      )
      if (!createUserRes.success) {
        res.redirect(`/moodlenet-passport-auth/login-fail?msg=couldn't create user`)
        return
      }
      token = createUserRes.sessionToken
    } else {
      token = getTokenData.sessionToken
    }

    res.redirect(`/moodlenet-passport-auth/login-success?token=${token}`)
  })

  /* POST /logout
   *
   * This route logs the user out.
   */
  app.post('/logout', function (req, res) {
    req.logout({}, () => console.log('logout'))
    res.redirect('/')
  })
}
