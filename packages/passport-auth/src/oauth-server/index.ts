// import csrf from 'csurf'
import { ExtShell } from '@moodlenet/core'
import type { Express } from 'express'
import { PassportAuthExt } from '..'
import { getAuthMngUidByOauthResult } from './lib'
import getPassport from './passport'

export function prepareApp(shell: ExtShell<PassportAuthExt>, app: Express) {
  const [, , , auth] = shell.deps
  // app.use(csrf())
  app.get('/login/federated/:providerName', async (req, res, next) => {
    const passport = await getPassport(shell)
    passport.authenticate(req.params.providerName, {
      session: false,
    })(req, res, next)
  })

  app.get('/oauth2/redirect/:providerName', async (req, res, next) => {
    const passport = await getPassport(shell)
    passport.authenticate(req.params.providerName, {
      session: false,
    })(req, res, next)
  })

  app.get('/oauth2/redirect/:providerName', async (req, res) => {
    // console.log('***', req.params.providerName, inspect(req.user, false, 10, true))
    if (!req.user) {
      res.redirect(`/@moodlenet/passport-auth/login-fail?msg=couldn't authenticate`)
      return
    }
    const uid = getAuthMngUidByOauthResult(req.user.oauth)
    const {
      msg: { data: getTokenData },
    } = await auth.access.fetch('getSessionToken')({
      uid,
    })

    let token: string
    if (!getTokenData.success) {
      const {
        msg: { data: createUserRes },
      } = await auth.access.fetch('registerUser')({
        uid,
        displayName: req.user.oauth.profile.displayName,
        avatarUrl: req.user.oauth.profile.photos?.[0]?.value,
      })
      if (!createUserRes.success) {
        res.redirect(`/@moodlenet/passport-auth/login-fail?msg=couldn't create user`)
        return
      }
      token = createUserRes.sessionToken
    } else {
      token = getTokenData.sessionToken
    }

    res.redirect(`/@moodlenet/passport-auth/login-success?token=${token}`)
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
