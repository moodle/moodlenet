import type passport from 'passport'
import type passportGoogle from 'passport-google-oauth20'
export type ProviderName = 'google' | 'fb'

type _OauthResult<PN extends ProviderName, T> = T & { type: PN }
export type GoogleVerifyObj = _OauthResult<
  'google',
  {
    accessToken: string
    refreshToken: string
    profile: passportGoogle.Profile
  }
>

export type FbVerifyObj = _OauthResult<
  'fb',
  {
    x: string
    profile: passport.Profile
  }
>

export type OauthResult = GoogleVerifyObj | FbVerifyObj
