import { DocumentMetadata, DocumentSelector, Patch } from '@moodlenet/arangodb/server'
import assert from 'assert'
import { db, WebUserCollection, WebUserProfile } from './init.mjs'
import { CreateRequest, WebUserDataType, WebUserProfileDataType } from './types.mjs'

export async function createWebUser(createRequest: CreateRequest) {
  const { contacts, isAdmin, userKey, ...profileData } = createRequest
  const newProfile = await WebUserProfile.create(
    profileData,
    // getWebUserProfileSearchData(profileData),
  )
  const webUserData: WebUserDataType = {
    profileKey: newProfile._key,
    displayName: newProfile.displayName,
    isAdmin,
    userKey,
    contacts,
  }

  const { new: newWebUser } = await WebUserCollection.save(webUserData, { returnNew: true })
  assert(newWebUser)
  return newWebUser
}

// function getWebUserProfilePartSearchData(
//   profileData: Partial<Pick<WebUserProfileDataType, 'displayName' | 'aboutMe'>>,
// ): Partial<SearchData> {
//   return {
//     description: profileData.aboutMe,
//     title: profileData.displayName,
//   }
// }
// function getWebUserProfileSearchData(
//   profileData: Pick<WebUserProfileDataType, 'displayName' | 'aboutMe'>,
// ): SearchData {
//   return {
//     description: profileData.aboutMe,
//     title: profileData.displayName,
//   }
// }

export async function editWebUserProfile(
  sel: DocumentSelector,
  updateWithData: Partial<WebUserProfileDataType>,
) {
  const mUpdated = await WebUserProfile.patch(
    sel,
    updateWithData,
    // getWebUserProfilePartSearchData(updateWithData),
  )

  if (!mUpdated) {
    return null
  }
  const { old: oldData, new: newData } = mUpdated
  const displayNameChanged = newData.displayName && oldData.displayName !== newData.displayName
  if (displayNameChanged) {
    await patchWebUser({ profileKey: oldData._key }, { displayName: newData.displayName })
  }

  return newData
}

export async function getWebUser(
  by: { profileKey: string } | { userKey: string },
): Promise<(WebUserDataType & DocumentMetadata) | undefined> {
  const byUserKey = 'userKey' in by
  const key = byUserKey ? by.userKey : by.profileKey
  const foundUsersCursor = await db.query<WebUserDataType & DocumentMetadata>(
    `
      FOR user in @@WebUserCollection
        FILTER user.${byUserKey ? 'userKey' : 'profileKey'} == @key
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
        FILTER user.${byUserKey ? 'userKey' : 'profileKey'} == @key
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

export async function getProfile(
  sel: DocumentSelector,
): Promise<null | (WebUserProfileDataType & DocumentMetadata)> {
  const profile = await WebUserProfile.get(sel)
  return profile
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

  return userProfiles //.map(extractNodeMeta).map(({ node }) => node)
}
