import { Shell } from '@moodlenet/core'
import { Passport } from 'passport'
import passportGoogle from 'passport-google-oauth20'
import { PassportAuthExt } from '..'

async function getPassport(shell: Shell<PassportAuthExt>) {
  const {
    msg: {
      data: { configs },
    },
  } = await shell.lib.fetch<PassportAuthExt>(shell)('moodlenet-passport-auth@0.1.10::get')()

  const passport = new Passport()
  if (configs.google) {
    passport.use(
      'google',
      new passportGoogle.Strategy(
        {
          clientID: configs.google.apiKey,
          clientSecret: configs.google.apiSecret,
          callbackURL: '/_/moodlenet-passport-auth/oauth2/redirect/google',
          scope: ['profile'],
        },
        (accessToken, refreshToken, profile, done) => {
          // console.log('verifier ', { accessToken, refreshToken, profile })
          done(null, { oauth: { type: 'google', accessToken, refreshToken, profile } })
        },
      ),
    )
  }

  return passport
}

export default getPassport
