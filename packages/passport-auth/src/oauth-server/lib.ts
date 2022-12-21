import type { UserId } from '../../../authentication-manager/dist/init.mjs'
import assert from 'assert'
import { OauthResult, ProviderName } from './types'

const SEP = '::'

export function getAuthMngUidByOauthResult(oauthResult: OauthResult) {
  return getAuthMngUid(oauthResult.type, oauthResult.profile.id)
}

export function getAuthMngUid(provider: ProviderName, profileId: string) {
  return `${provider}${SEP}${profileId}`
}

export function splitAuthMngUid(uid: UserId) {
  const splitArr = uid.split(SEP)
  assert(splitArr.length === 2, `malformed uid: [${uid}]`)
  const [provider, profileId] = splitArr
  assert(isProvider(provider) && profileId?.length, `unknown provider: [${provider}]`)
  return { provider, profileId }
}

function isProvider(_: any): _ is ProviderName {
  // return providerNames.includes(provider)
  return true
}
