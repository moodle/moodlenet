import type { Patch } from '@moodlenet/arangodb/server'
import { isArangoError } from '@moodlenet/arangodb/server'
import type { JwtToken } from '@moodlenet/crypto/server'
import { jwt } from '@moodlenet/crypto/server'
import { send } from '@moodlenet/email-service/server'
import { getCurrentHttpCtx, getMyRpcBaseUrl } from '@moodlenet/http-server/server'
import { getOrgData } from '@moodlenet/organization/server'
import { webSlug } from '@moodlenet/react-app/common'
import { create, matchRootPassword } from '@moodlenet/system-entities/server'
import type { CookieOptions } from 'express'
import { deleteAccountEmail } from '../../common/emails/Access/DeleteAccountEmail/DeleteAccountEmail'
import {
  WEB_USER_SESSION_TOKEN_AUTHENTICATED_BY_COOKIE_NAME,
  WEB_USER_SESSION_TOKEN_COOKIE_NAME,
} from '../../common/exports.mjs'
import type { AdminSearchUserSortType } from '../../common/expose-def.mjs'
import { Profile } from '../exports.mjs'
import { WebUserCollection, db } from '../init/arangodb.mjs'
import { shell } from '../shell.mjs'
import type {
  CreateRequest,
  ProfileDataType,
  TokenCtx,
  TokenVersion,
  UnverifiedTokenCtx,
  VerifiedTokenCtx,
  WebUserAccountDeletionToken,
  WebUserDataType,
  WebUserJwtPayload,
  WebUserRecord,
} from '../types.mjs'

const VALID_JWT_VERSION: TokenVersion = 1
export async function signWebUserJwt(
  webUserJwtPayload: Omit<WebUserJwtPayload, 'v'>,
): Promise<JwtToken> {
  const sessionToken = await shell.call(jwt.sign)(
    { ...webUserJwtPayload, v: VALID_JWT_VERSION },
    {
      expirationTime: '1w',
      subject: webUserJwtPayload.isRoot ? undefined : webUserJwtPayload.webUser?._key,
      scope: [/* 'full-user',  */ 'openid'],
    },
  )
  return sessionToken
}

export async function getCurrentProfileIds() {
  const tokenCtx = await verifyCurrentTokenCtx()
  if (!tokenCtx || tokenCtx.payload.isRoot) {
    return
  }

  return tokenCtx.payload.profile
}

export async function getCurrentWebUserIds() {
  const tokenCtx = await verifyCurrentTokenCtx()
  if (!tokenCtx || tokenCtx.payload.isRoot) {
    return
  }
  return tokenCtx.payload.webUser
}

//BEWARE ! this token is valued by webapp only!! e.g. won't be by oauth !!
export async function verifyCurrentTokenCtx() {
  const currentCtx = shell.myAsyncCtx.get()
  if (!currentCtx?.tokenCtx) {
    return
  }
  if (currentCtx.tokenCtx.type === 'verified-token') {
    return currentCtx.tokenCtx
  }
  const { currentJwtToken } = currentCtx.tokenCtx
  const jwtVerifyResult = await shell.call(jwt.verify)<WebUserJwtPayload>(
    currentJwtToken,
    isWebUserJwtPayload,
  )
  if (!jwtVerifyResult) {
    unsetTokenContext()
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

export function unsetTokenContext() {
  shell.myAsyncCtx.unset()
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

export async function setCurrentTokenCtx(tokenCtx: TokenCtx) {
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

// export async function verifyWebUserToken(token: JwtToken) {
//   const jwtVerifyResult = await shell.call(jwt.verify)<WebUserJwtPayload>(token)
//   shell.log('debug', { jwtVerifyResult })
//   if (!(jwtVerifyResult && jwtVerifyResult.payload.v === VALID_JWT_VERSION)) {
//     return
//   }

//   return jwtVerifyResult.payload
// }

////

export function sendWebUserTokenCookie(jwtToken: JwtToken | undefined) {
  const { pkgId } = shell.assertCallInitiator()
  const httpCtx = getCurrentHttpCtx()
  const httpResponse = httpCtx?.response
  // shell.log('debug', { httpResponse, jwtToken, jwtTokenL: jwtToken?.length })
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
}): Promise<WebUserRecord | undefined> {
  const foundUsersCursor = await db.query<WebUserRecord>(
    `
      FOR user in @@WebUserCollection
        FILTER user.profileKey == @profileKey
        LIMIT 1
        FILTER !user.deleted && !user.deleting
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
    points: 0,
    webslug: webSlug(profileData.displayName),
    settings: {},
    publishedContributions: {
      collections: 0,
      resources: 0,
    },
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
    publisher: createData.publisher,
    contacts,
    moderation: {
      reports: { amount: 0, items: [], mainReasonName: null },
      status: {
        history: [],
      },
    },
    lastVisit: {
      at: new Date().toISOString(),
    },
  }

  const { new: newWebUser } = await WebUserCollection.save(webUserData, { returnNew: true })

  if (!newWebUser) {
    return
  }

  shell.events.emit('created-web-user-account', {
    profileKey: newProfile._key,
    webUserKey: newWebUser._key,
  })
  const jwtToken = await signWebUserJwt({
    webUser: {
      _key: newWebUser._key,
      displayName: newWebUser.displayName,
      isAdmin: newWebUser.isAdmin,
    },
    profile: {
      _id: newProfile._id,
      _key: newProfile._key,
      publisher: newProfile.publisher,
    },
  })

  return {
    newWebUser,
    newProfile,
    jwtToken,
  }
}
export async function signWebUserJwtToken({
  webUserkey,
  sendTokenCookie,
}: {
  webUserkey: string
  sendTokenCookie: boolean
}) {
  const webUser = await getWebUser({ _key: webUserkey })
  if (!webUser) {
    return
  }
  const profile = await Profile.collection.document(
    { _key: webUser.profileKey },
    { graceful: true },
  )

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
      publisher: profile.publisher,
    },
  })
  if (sendTokenCookie) {
    shell.call(sendWebUserTokenCookie)(jwtToken)
    shell.events.emit('web-user-logged-in', {
      profileKey: profile._key,
      webUserKey: webUser._key,
    })
  }
  return jwtToken
}
export async function getWebUser({
  _key,
}: {
  _key: string
}): Promise<WebUserRecord | undefined | null> {
  const foundUser = await WebUserCollection.document({ _key }, { graceful: true })
  if (!foundUser) {
    return null
  }
  return foundUser.deleted || foundUser.deleting ? null : foundUser
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
  return WebUserCollection.update({ _key }, patch, { returnNew: true, returnOld: true }).catch(
    err => {
      if (isArangoError(err) && err.errorNum === 1202) {
        return {
          new: undefined,
          old: undefined,
        }
      }
      throw err
    },
  )
}

export async function setWebUserIsAdmin(
  req: { isAdmin: boolean } & ({ profileKey: string } | { userKey: string }),
) {
  const byUserKey = 'userKey' in req
  const key = byUserKey ? req.userKey : req.profileKey
  const isAdmin = req.isAdmin

  const patchedCursor = await db.query(
    `
      FOR user in @@WebUserCollection
        FILTER user.${byUserKey ? '_key' : 'profileKey'} == @key
        LIMIT 1
        FILTER !user.deleted && !user.deleting
        UPDATE user
        WITH { isAdmin: @isAdmin }
        INTO @@WebUserCollection
      RETURN NEW
    `,
    { key, '@WebUserCollection': WebUserCollection.name, isAdmin },
    {
      retryOnConflict: 5,
    },
  )

  const [patchedUser] = await patchedCursor.all()
  return patchedUser
}

export type WebUserSearchOpts = {
  fetchReporters: boolean
  sortType: AdminSearchUserSortType // | 'SearchMatch'
  searchString: string
  filterNoFlag: boolean
}
type WebUserSearchType = WebUserRecord & {
  moderation: {
    reports: { items: { reporter?: null | WebUserRecord }[] }
    status: { history: { reporter?: null | WebUserRecord }[] }
  }
}

export async function searchUsersForModeration({
  fetchReporters,
  searchString,
  sortType,
  filterNoFlag,
}: WebUserSearchOpts): Promise<WebUserSearchType[]> {
  const sort = searchString
    ? 'matchScore DESC'
    : sortType === 'DisplayName'
      ? 'webUser.displayName ASC'
      : sortType === 'MainReason'
        ? 'webUser.moderation.reports.mainReasonName ASC'
        : sortType === 'Flags'
          ? 'webUser.moderation.reports.amount DESC'
          : sortType === 'LastFlag'
            ? 'webUser.moderation.reports[0].date DESC'
            : sortType === 'Status'
              ? '(webUser.deleted ? 3 : webUser.isAdmin ? 1 : webUser.publisher ? 2 : 4) ASC'
              : 'webUser.displayName ASC'

  const returnWebUser = fetchReporters
    ? `MERGE_RECURSIVE(webUser, { 
                        moderation: { 
                          reports: { 
                            items: (FOR item IN webUser.moderation.reports.items 
                                    LET reporter = DOCUMENT(@@WebUserCollection, item.reporterWebUserKey) 
                                    RETURN MERGE_RECURSIVE( item, { reporter } ))
                          },
                          status: { 
                            history: (FOR item IN webUser.moderation.status.history 
                                      LET reporter = DOCUMENT(@@WebUserCollection, item.byWebUserKey) 
                                      RETURN MERGE_RECURSIVE( item, { reporter } ))
                          }
                        }
                      })`
    : `webUser`
  const filterNoFlagQuery = filterNoFlag ? `webUser.moderation.reports.amount > 0 &&` : ''
  const searchQuery = `
FOR webUser in @@WebUserCollection
let matchScore = LENGTH(@searchString) < 1 ? 1 
                  : MAX([ 
                    NGRAM_SIMILARITY(webUser.displayName, @searchString, 3),
                    NGRAM_SIMILARITY(webUser.contacts.email, @searchString, 3)
                  ])
FILTER ${filterNoFlagQuery} matchScore > 0.3
SORT ${sort} 
LIMIT 40
LET returnWebUser = ${returnWebUser}
RETURN returnWebUser`

  const cursor = await db.query<WebUserSearchType>(searchQuery, {
    searchString,
    '@WebUserCollection': WebUserCollection.name,
  })

  const webUsers = await cursor.all()
  return webUsers
}

export async function ignoreUserReports({ forWebUserKey }: { forWebUserKey: string }) {
  return WebUserCollection.update(
    { _key: forWebUserKey },
    { moderation: { reports: { amount: 0, items: [], mainReasonName: null } } },
    { returnNew: true },
  )
}

export async function currentWebUserDeletionAccountRequest() {
  //Confirm account deletion 🥀

  const currWebUserIds = await getCurrentWebUserIds()
  if (!currWebUserIds) {
    return
  }
  const currWebUser = await getWebUser({ _key: currWebUserIds._key })
  if (!currWebUser) {
    return
  }
  const token = await signWebUserAccountDeletionToken(currWebUserIds._key)
  const orgData = await getOrgData()
  const actionUrl = `${await shell.call(
    getMyRpcBaseUrl,
  )()}webapp/web-user/delete-account-request/confirm/${token}`

  shell.events.emit('web-user-delete-account-intent', {
    actionUrl,
    webUserKey: currWebUserIds._key,
  })

  if (currWebUser.contacts.email) {
    send(
      deleteAccountEmail({
        actionUrl,
        instanceName: orgData.data.instanceName,
        receiverEmail: currWebUser.contacts.email,
      }),
    )
  }
  return
}

export async function signWebUserAccountDeletionToken(webUserKey: string) {
  const webUserAccountDeletionToken: WebUserAccountDeletionToken = {
    scope: 'web-user-account-deletion',
    webUserKey,
  }
  return jwt.sign(webUserAccountDeletionToken, { expirationTime: '1d' })
}

export function isWebUserAccountDeletionToken(
  payload: any,
): payload is WebUserAccountDeletionToken {
  return payload?.scope === 'web-user-account-deletion'
}

function isWebUserJwtPayload(_: any): _ is WebUserJwtPayload {
  // TODO: better validation
  return _?.v === VALID_JWT_VERSION && [true, false, undefined].some(__ => _?.isRoot === __)
}
