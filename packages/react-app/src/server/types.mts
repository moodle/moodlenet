import { JwtToken, JwtVerifyResult } from '@moodlenet/crypto/server'
import { Response } from 'express'
import { AppearanceData } from '../common/types.mjs'

export type WebUserProfileDataType = {
  displayName: string
  aboutMe: string
  organizationName?: string
  location?: string
  siteUrl?: string
}

export type WebUserProfile = WebUserProfileDataType & { _key: string }

export type WebUserDataType = {
  displayName: string
  contacts: Contacts
  isAdmin: boolean
  profileKey: string
}

export type Contacts = {
  email?: string
}

export type CreateRequest = Pick<WebUserDataType, 'contacts' | 'isAdmin'> & WebUserProfileDataType

export type KeyValueData = { appearanceData: AppearanceData }

export type WebUserJwtPayload =
  | {
      isRoot: true
    }
  | {
      isRoot?: false
      isAdmin: boolean
      webUserKey: string
      accountId: string
    }

export type WebUserCtxType = {
  http?: { resp: Response; enteringToken?: JwtToken }
  tokenCtx?: TokenCtx
}
export type TokenCtx = VerifiedTokenCtx | UnverifiedTokenCtx

export type VerifiedTokenCtx = {
  type: 'verified-token'
  currentJwtToken: JwtToken
  currentWebUser: JwtVerifyResult<WebUserJwtPayload>['payload']
}

export type UnverifiedTokenCtx = {
  type: 'unverified-token'
  currentJwtToken: JwtToken
}
