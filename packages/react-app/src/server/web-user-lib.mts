import { DocumentMetadata, Patch } from '@moodlenet/arangodb/server'
import {
  ByKeyOrId,
  create,
  getEntity,
  patch,
  setPkgCurrentUser,
} from '@moodlenet/system-entities/server'
import { ClientSessionDataRpc } from '../common/types.mjs'
import { db, WebUserCollection, WebUserProfile } from './init.mjs'
import {
  CreateRequest,
  WebUserDataType,
  WebUserProfileDataType,
  WebUserProfileEntity,
} from './types.mjs'
import {
  setCurrentVerifiedJwtToken,
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

  const myProfile = await getProfile({ _key: currentWebUser.profileKey })
  return myProfile
}

export async function getCurrentClientSessionDataRpc(): Promise<ClientSessionDataRpc | undefined> {
  const verifiedCtx = await verifyCurrentTokenCtx()
  console.log('getCurrentClientSessionDataRpc', { verifiedCtx })
  if (!verifiedCtx) {
    return
  }
  const { currentWebUser } = verifiedCtx
  if (currentWebUser.isRoot) {
    return {
      isRoot: true,
    }
  }
  // await setCurrentVerifiedJwtToken(verifiedCtx, false)

  const myProfile = await getProfile({ _key: currentWebUser.profileKey })
  if (!myProfile) {
    //FIXME: throw error ?
    return
  }

  return {
    isAdmin: currentWebUser.isAdmin,
    isRoot: false,
    myProfile,
  }
}

type CreateOpts = {
  setAsCurrentUser: boolean
}
export async function createWebUser(createRequest: CreateRequest, opts?: Partial<CreateOpts>) {
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
  if (opts?.setAsCurrentUser) {
    const jwtToken = await signWebUserJwt({
      isAdmin,
      webUserKey: newWebUser._key,
      profileKey: newProfile._key,
    })
    setCurrentVerifiedJwtToken(jwtToken, true)
  }
  return newWebUser
}

export async function editWebUserProfile(
  byKeyOrId: ByKeyOrId,
  updateWithData: Partial<WebUserProfileDataType>,
) {
  const mUpdated = await patch(WebUserProfile.entityClass, byKeyOrId, updateWithData)

  if (!mUpdated) {
    return
  }
  const { entity, patched } = mUpdated
  const displayNameChanged = patched.displayName && entity.displayName !== patched.displayName
  if (displayNameChanged) {
    await patchWebUser({ profileKey: entity._key }, { displayName: patched.displayName })
  }

  return patched
}

export async function setCurrentWebUser(by: { profileKey: string } | { userKey: string }) {
  const webUser = await getWebUser(by)
  if (!webUser) {
    return false
  }
  const jwtToken = await signWebUserJwt({
    isAdmin: webUser.isAdmin,
    webUserKey: webUser._key,
    profileKey: webUser.profileKey,
  })
  await setCurrentVerifiedJwtToken(jwtToken, true)
  return true
}

export async function getWebUser(
  by: { profileKey: string } | { userKey: string },
): Promise<(WebUserDataType & DocumentMetadata) | undefined> {
  const byUserKey = 'userKey' in by
  const key = byUserKey ? by.userKey : by.profileKey
  const foundUsersCursor = await db.query<WebUserDataType & DocumentMetadata>(
    `
      FOR user in @@WebUserCollection
        FILTER user.${byUserKey ? '_key' : 'profileKey'} == @key
        LIMIT 1
      RETURN user
    `,
    { key, '@WebUserCollection': WebUserCollection.name },
  )
  const [foundUser] = await foundUsersCursor.all()
  return foundUser
}

export async function patchWebUser(
  by: { profileKey: string } | { userKey: string },
  patch: Patch<WebUserDataType>, // | string,
) {
  const byUserKey = 'userKey' in by
  const key = byUserKey ? by.userKey : by.profileKey

  const patchedCursor = await db.query(
    `
      FOR user in @@WebUserCollection
        FILTER user.${byUserKey ? '_key' : 'profileKey'} == @key
        LIMIT 1
        UPDATE user
        //! ///////////////////////////////WITH ${typeof patch === 'string' ? patch : '@patch'} 
        WITH @patch
        INTO @@WebUserCollection
      RETURN NEW
    `,
    { patch, key, '@WebUserCollection': WebUserCollection.name },
  )

  const [patchedUser] = await patchedCursor.all()
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

export async function getProfile(byKeyOrId: ByKeyOrId): Promise<undefined | WebUserProfileEntity> {
  const profile = await getEntity(WebUserProfile.entityClass, byKeyOrId, {
    projectAccess: ['d', 'u'],
  })
  return profile?.entity
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
