import { DocumentMetadata } from '@moodlenet/arangodb/server'
import {
  create,
  EntityAccess,
  getEntity,
  Patch,
  patchEntity,
  setPkgCurrentUser,
} from '@moodlenet/system-entities/server'
import assert from 'assert'
import { ClientSessionDataRpc } from '../common/types.mjs'
import { db, WebUserCollection, WebUserProfile } from './init.mjs'
import {
  CreateRequest,
  WebUserDataType,
  WebUserProfileDataType,
  WebUserProfileEntity,
} from './types.mjs'
import {
  sendWebUserTokenCookie,
  signWebUserJwt,
  verifyCurrentTokenCtx,
} from './web-user-auth-lib.mjs'

export async function getCurrentWebUserProfile(): Promise<WebUserProfileEntity | undefined> {
  const verifiedCtx = await verifyCurrentTokenCtx()
  if (!verifiedCtx) {
    return
  }
  const { currentWebUser } = verifiedCtx
  if (currentWebUser.isRoot) {
    return
  }

  const myProfileRecord = await getProfileRecord(currentWebUser.profileKey)
  return myProfileRecord?.entity
}

export async function getCurrentClientSessionDataRpc(): Promise<ClientSessionDataRpc | undefined> {
  const verifiedCtx = await verifyCurrentTokenCtx()
  console.log('getCurrentClientSessionDataRpc', { verifiedCtx })
  if (!verifiedCtx) {
    sendWebUserTokenCookie(undefined)
    return
  }
  const { currentWebUser } = verifiedCtx
  if (currentWebUser.isRoot) {
    return {
      isRoot: true,
    }
  }
  // await setCurrentVerifiedJwtToken(verifiedCtx, false)

  const webUser = await getWebUser({ _key: currentWebUser.webUserKey })
  if (!webUser) {
    sendWebUserTokenCookie(undefined)
    return
  }
  assert(
    webUser.profileKey === currentWebUser.profileKey,
    `webUser.profileKey:${webUser.profileKey} not equals currentWebUser.profileKey:${currentWebUser.profileKey}`,
  )
  const profileRecord = await getProfileRecord(currentWebUser.profileKey)
  assert(
    profileRecord,
    `couldn't find Profile#${currentWebUser.profileKey} associated with WebUser#${currentWebUser.webUserKey}:${webUser.displayName}`,
  )

  return {
    isAdmin: webUser.isAdmin,
    isRoot: false,
    myProfile: profileRecord.entity,
  }
}

export async function createWebUser(createRequest: CreateRequest) {
  const { contacts, isAdmin, ...profileData } = createRequest
  await setPkgCurrentUser()
  const newProfile = await create(WebUserProfile.entityClass, profileData)

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
    webUserKey: newWebUser._key,
    profileKey: newProfile._key,
  })

  return {
    newWebUser,
    newProfile,
    jwtToken,
  }
}

export async function editWebUserProfile(
  key: string,
  updateWithData: Partial<WebUserProfileDataType>,
  opts?: {
    projectAccess?: EntityAccess[]
  },
) {
  const webUser = await getWebUserByProfileKey({ profileKey: key })
  assert(webUser, `couldn't find associated WebUser for profileKey ${key}`)

  const mUpdated = await patchEntity(WebUserProfile.entityClass, key, updateWithData, opts)

  if (!mUpdated) {
    return
  }
  const { entity, patched /* ,meta */ } = mUpdated
  const displayNameChanged = patched.displayName && entity.displayName !== patched.displayName
  if (displayNameChanged) {
    await patchWebUser({ _key: webUser._key }, { displayName: patched.displayName })
  }

  return mUpdated
}

export async function signWebUserJwtToken({ webUserkey }: { webUserkey: string }) {
  const webUser = await getWebUser({ _key: webUserkey })
  if (!webUser) {
    return
  }
  const jwtToken = await signWebUserJwt({
    webUserKey: webUser._key,
    profileKey: webUser.profileKey,
  })
  return jwtToken
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
export async function getWebUser({
  _key,
}: {
  _key: string
}): Promise<(WebUserDataType & DocumentMetadata) | undefined> {
  const foundUser = await WebUserCollection.document({ _key }, { graceful: true })
  return foundUser
}

export async function patchWebUser(
  { _key }: { _key: string },
  patch: Patch<WebUserDataType>, // | string,
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

export async function getProfileRecord(
  key: string,
  opts?: {
    projectAccess?: EntityAccess[]
  },
) {
  const record = await getEntity(WebUserProfile.entityClass, key, {
    projectAccess: opts?.projectAccess,
  })
  return record
}

export async function searchUsers(search: string): Promise<(WebUserDataType & DocumentMetadata)[]> {
  const cursor = await db.query(
    `
    FOR profileUser in @@WebUserCollection
    let matchScore = LENGTH(@search) < 1 ? 1 
                      : NGRAM_POSITIONAL_SIMILARITY(profileUser.name, @search, 2)
                      + NGRAM_POSITIONAL_SIMILARITY(profileUser.contacts.email, @search, 2)
    SORT matchScore DESC
    FILTER matchScore > 0.05
    LIMIT 10
    RETURN profileUser`,
    { search, '@WebUserCollection': WebUserCollection.name },
  )

  const userProfiles = await cursor.all()

  return userProfiles
}
