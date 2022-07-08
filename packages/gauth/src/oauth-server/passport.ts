import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './config'

function getPassport() {
  passport.use(
    'google',
    new passportGoogle.Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/_/moodlenet-gauth/oauth2/redirect/google',
        scope: ['profile'],
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log('verifier ', { accessToken, refreshToken, profile })
        done(null, { oauth: { type: 'google', accessToken, refreshToken, profile } })
      },
    ),
  )

  return passport
}

export default getPassport
