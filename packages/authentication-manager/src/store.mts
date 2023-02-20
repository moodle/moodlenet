import { DocumentSelector } from '@moodlenet/arangodb'
import assert from 'assert'
import { db, UserCollection } from './init.mjs'
import { ProviderId, UserData, UserDocument } from './store/types.mjs'

export async function getByProviderId(providerId: ProviderId): Promise<UserDocument | undefined> {
  const foundUserCursor = await db.query<UserDocument>(
    `FOR u in @@UserCollection
              FILTER u.providerId == @providerId
              LIMIT 1
            RETURN u`,
    { providerId, '@UserCollection': UserCollection.name },
  )

  const [foundUser] = await foundUserCursor.all()

  return foundUser
}

export async function getById(sel: DocumentSelector): Promise<UserDocument | null> {
  const m_user = await UserCollection.document(sel, true)
  return m_user
}

export async function delUser(sel: DocumentSelector) {
  const { old } = await UserCollection.remove(sel, { returnOld: true })

  return old
}

export async function modUser(sel: DocumentSelector, modUser: Partial<UserDocument>) {
  const { old } = await UserCollection.update(sel, modUser, { returnOld: true })

  return old
}

export async function create(newUserData: Omit<UserData, 'created'>): Promise<UserDocument> {
  const { new: newUser } = await UserCollection.save(
    {
      ...newUserData,
      created: new Date().toISOString(),
    },
    { returnNew: true, overwriteMode: 'conflict' },
  )
  assert(newUser, 'no user after creation !')
  return newUser
}
