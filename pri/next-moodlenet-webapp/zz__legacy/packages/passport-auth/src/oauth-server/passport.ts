import type { ExtShell } from '@moodlenet/core'
import { Passport } from 'passport'
import passportGoogle from 'passport-google-oauth20'
import type { PassportAuthExt } from '..'

async function getPassport(shell: ExtShell<PassportAuthExt>) {
  const {
    msg: {
      data: { configs },
    },
  } = await shell.me.fetch('get')()

  const passport = new Passport()
  if (configs.google) {
    passport.use(
      'google',
      new passportGoogle.Strategy(
        {
          clientID: configs.google.apiKey,
          clientSecret: configs.google.apiSecret,
          callbackURL: '/_/@moodlenet/passport-auth/oauth2/redirect/google',
          scope: ['profile'],
        },
        (accessToken, refreshToken, profile, done) => {
          done(null, { oauth: { type: 'google', accessToken, refreshToken, profile } })
        },
      ),
    )
  }

  return passport
}

export default getPassport
