// import csrf from 'csurf'
import type { Express } from 'express'
import getPassport from './passport'

export function prepareApp(app: Express) {
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
    res.redirect(req.user ? `/moodlenet-gauth/login-success` : '/moodlenet-gauth/login-fail')
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
