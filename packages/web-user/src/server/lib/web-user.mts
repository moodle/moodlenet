import type { DocumentMetadata, Patch } from '@moodlenet/arangodb/server'
import type { JwtToken } from '@moodlenet/crypto/server'
import { jwt } from '@moodlenet/crypto/server'
import { getCurrentHttpCtx } from '@moodlenet/http-server/server'
import { webSlug } from '@moodlenet/react-app/common'
import { create, matchRootPassword } from '@moodlenet/system-entities/server'
import type { CookieOptions } from 'express'
import {
  WEB_USER_SESSION_TOKEN_AUTHENTICATED_BY_COOKIE_NAME,
  WEB_USER_SESSION_TOKEN_COOKIE_NAME,
} from '../../common/exports.mjs'
import { Profile } from '../exports.mjs'
import { db, WebUserCollection } from '../init/arangodb.mjs'
import { shell } from '../shell.mjs'
import type {
  CreateRequest,
  ProfileDataType,
  TokenCtx,
  UnverifiedTokenCtx,
  VerifiedTokenCtx,
  WebUserDataType,
  WebUserJwtPayload,
} from '../types.mjs'

export async function signWebUserJwt(webUserJwtPayload: WebUserJwtPayload): Promise<JwtToken> {
  const sessionToken = await shell.call(jwt.sign)(webUserJwtPayload, {
    expirationTime: '2w',
    subject: webUserJwtPayload.isRoot ? undefined : webUserJwtPayload.webUser._key,
    scope: [/* 'full-user',  */ 'openid'],
  })
  return sessionToken
}

export async function getCurrentProfileIds() {
  const tokenCtx = await verifyCurrentTokenCtx()
  if (!tokenCtx || tokenCtx.payload.isRoot) {
    return
  }
  return tokenCtx.payload.profile
}
export async function verifyCurrentTokenCtx() {
  const currentCtx = shell.myAsyncCtx.get()
  if (!currentCtx?.tokenCtx) {
    return
  }
  if (currentCtx.tokenCtx.type === 'verified-token') {
    return currentCtx.tokenCtx
  }
  const { currentJwtToken } = currentCtx.tokenCtx
  const jwtVerifyResult = await shell.call(jwt.verify)<WebUserJwtPayload>(currentJwtToken)
  if (!jwtVerifyResult) {
    shell.myAsyncCtx.unset()
    return
  }
  const { payload } = jwtVerifyResult
  const verifiedTokenCtx: VerifiedTokenCtx = {
    type: 'verified-token',
    currentJwtToken,
    payload,
  }

  return verifiedTokenCtx
}

export async function loginAsRoot(rootPassword: string): Promise<boolean> {
  const rootPasswordMatch = await matchRootPassword(rootPassword)
  if (!rootPasswordMatch) {
    return false
  }
  const jwtToken = await signWebUserJwt({ isRoot: true })
  shell.call(sendWebUserTokenCookie)(jwtToken)
  return true
}

async function setCurrentTokenCtx(tokenCtx: TokenCtx) {
  shell.myAsyncCtx.set(current => ({ ...current, tokenCtx }))
}

export async function setCurrentUnverifiedJwtToken(currentJwtToken: JwtToken) {
  const unverifiedTokenCtx: UnverifiedTokenCtx = {
    type: 'unverified-token',
    currentJwtToken,
  }
  await setCurrentTokenCtx(unverifiedTokenCtx)
}

// export async function setCurrentVerifiedJwtToken(currentJwtToken: JwtToken, sendCookie: boolean) {
//   const currentWebUser = await verifyWebUserToken(currentJwtToken)
//   assert(currentWebUser)
//   const verifiedTokenCtx: VerifiedTokenCtx = {
//     type: 'verified-token',
//     currentJwtToken,
//     currentWebUser,
//   }
//   await setCurrentTokenCtx(verifiedTokenCtx, sendCookie)
// }

export async function verifyWebUserToken(token: JwtToken) {
  const jwtVerifyResult = await shell.call(jwt.verify)<WebUserJwtPayload>(token)
  return jwtVerifyResult?.payload
}

////

export function sendWebUserTokenCookie(jwtToken: JwtToken | undefined) {
  const { pkgId } = shell.assertCallInitiator()
  const httpCtx = getCurrentHttpCtx()
  const httpResponse = httpCtx?.response
  // shell.log('info', { httpResponse, jwtToken, jwtTokenL: jwtToken?.length })
  if (!httpResponse) {
    return
  }

  if (!jwtToken) {
    const clearCookieOptions: CookieOptions = {
      /** FIXME: set proper options !!! */
    }
    httpResponse.clearCookie(WEB_USER_SESSION_TOKEN_COOKIE_NAME, clearCookieOptions)
    return
  }
  const setCookieOptions: CookieOptions = {
    /** FIXME: set proper options !!! */
  }
  httpResponse.cookie(WEB_USER_SESSION_TOKEN_COOKIE_NAME, jwtToken, setCookieOptions)
  httpResponse.cookie(
    WEB_USER_SESSION_TOKEN_AUTHENTICATED_BY_COOKIE_NAME,
    pkgId.name,
    setCookieOptions,
  )
  return
}

export async function getWebUserByProfileKey({
  profileKey,
}: {
  profileKey: string
}): Promise<(WebUserDataType & DocumentMetadata) | undefined> {
  const foundUsersCursor = await db.query<WebUserDataType & DocumentMetadata>(
    `
      FOR user in @@WebUserCollection
        FILTER user.profileKey == @profileKey
        LIMIT 1
      RETURN user
    `,
    { profileKey, '@WebUserCollection': WebUserCollection.name },
  )
  const foundUser = await foundUsersCursor.next()
  return foundUser
}
export async function createWebUser(createRequest: CreateRequest) {
  const { contacts, isAdmin, ...profileData } = createRequest
  const createData: ProfileDataType = {
    publisher: false,
    aboutMe: '',
    avatarImage: undefined,
    backgroundImage: undefined,
    location: '',
    organizationName: '',
    siteUrl: '',
    knownFeaturedEntities: [],
    kudos: 0,
    webslug: webSlug(profileData.displayName),
    ...profileData,
  }
  const newProfile = await create(Profile.entityClass, createData, { pkgCreator: true })

  if (!newProfile) {
    return
  }

  const webUserData: WebUserDataType = {
    profileKey: newProfile._key,
    displayName: newProfile.displayName,
    isAdmin,
    contacts,
  }

  const { new: newWebUser } = await WebUserCollection.save(webUserData, { returnNew: true })

  if (!newWebUser) {
    return
  }
  const jwtToken = await signWebUserJwt({
    webUser: {
      _key: newWebUser._key,
      displayName: newWebUser.displayName,
      isAdmin: newWebUser.isAdmin,
    },
    profile: {
      _id: newProfile._id,
      _key: newProfile._key,
    },
  })

  return {
    newWebUser,
    newProfile,
    jwtToken,
  }
}
export async function signWebUserJwtToken({ webUserkey }: { webUserkey: string }) {
  const webUser = await getWebUser({ _key: webUserkey })
  if (!webUser) {
    return
  }
  const profile = await Profile.collection.document({ _key: webUser.profileKey })

  if (!profile) {
    return
  }
  const jwtToken = await signWebUserJwt({
    webUser: {
      _key: webUser._key,
      displayName: webUser.displayName,
      isAdmin: webUser.isAdmin,
    },
    profile: {
      _id: profile._id,
      _key: profile._key,
    },
  })
  return jwtToken
}
export async function getWebUser({
  _key,
}: {
  _key: string
}): Promise<(WebUserDataType & DocumentMetadata) | undefined> {
  const foundUser = await WebUserCollection.document({ _key }, { graceful: true })
  return foundUser
}

export async function patchWebUserDisplayName({
  _key,
  displayName,
}: {
  _key: string
  displayName: string
}) {
  const { new: patchedUser } = await WebUserCollection.update(
    { _key },
    { displayName },
    { returnNew: true },
  )

  return patchedUser
}

export async function patchWebUser(
  { _key }: { _key: string },
  patch: Patch<Omit<WebUserDataType, 'displayName'>>, // | string,
) {
  const { new: patchedUser } = await WebUserCollection.update({ _key }, patch, { returnNew: true })

  return patchedUser
}

export async function toggleWebUserIsAdmin(by: { profileKey: string } | { userKey: string }) {
  const byUserKey = 'userKey' in by
  const key = byUserKey ? by.userKey : by.profileKey

  const patchedCursor = await db.query(
    `
      FOR user in @@WebUserCollection
        FILTER user.${byUserKey ? '_key' : 'profileKey'} == @key
        LIMIT 1
        UPDATE user
        WITH { isAdmin: !user.isAdmin }
        INTO @@WebUserCollection
      RETURN NEW
    `,
    { key, '@WebUserCollection': WebUserCollection.name },
  )

  const [patchedUser] = await patchedCursor.all()
  return patchedUser
}
export async function searchUsers(search: string): Promise<(WebUserDataType & DocumentMetadata)[]> {
  const cursor = await db.query(
    `
    FOR webUser in @@WebUserCollection
    let matchScore = LENGTH(@search) < 1 ? 1 
                      : NGRAM_POSITIONAL_SIMILARITY(webUser.name, @search, 2)
                      + NGRAM_POSITIONAL_SIMILARITY(webUser.contacts.email, @search, 2)
    SORT matchScore DESC
    FILTER matchScore > 0.05
    LIMIT 10
    RETURN webUser`,
    { search, '@WebUserCollection': WebUserCollection.name },
  )

  const webUsers = await cursor.all()

  return webUsers
}
