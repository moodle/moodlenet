import type { DocumentSelector } from '@moodlenet/arangodb/server'
import assert from 'assert'
import { db, EmailPwdUserCollection } from './init/arangodb.mjs'
import { shell } from './shell.mjs'
import type { Email, EmailPwdUser, EmailPwdUserData, EmailPwdUserDoc } from './store/types.mjs'

// await arangoPkg.api('ensureCollections')({ defs: { User: { kind: 'node' } } })

export async function getByEmail(email: Email): Promise<EmailPwdUser | undefined> {
  const cursor = await db.query<EmailPwdUserDoc | null>(
    `FOR u in @@EmailPwdUserCollection 
          FILTER u.email == @email
          LIMIT 1
        RETURN u`,
    { '@EmailPwdUserCollection': EmailPwdUserCollection.name, email },
  )

  const [userDoc] = await cursor.all()
  return _user(userDoc)
}

export async function getByWebUserKey(webUserKey: string): Promise<EmailPwdUser | undefined> {
  const cursor = await db.query<EmailPwdUserDoc | null>(
    `FOR u in @@EmailPwdUserCollection 
          FILTER u.webUserKey == @webUserKey
          LIMIT 1
        RETURN u`,
    { '@EmailPwdUserCollection': EmailPwdUserCollection.name, webUserKey },
  )

  const [userDoc] = await cursor.all()
  return _user(userDoc)
}

export async function getById(sel: DocumentSelector): Promise<EmailPwdUser | undefined> {
  const userDoc = await EmailPwdUserCollection.document(sel, { graceful: true })

  return _user(userDoc)
}

export async function delUser(sel: DocumentSelector) {
  const { old: oldUserDoc } = await EmailPwdUserCollection.remove(sel, { returnOld: true })

  return _user(oldUserDoc)
}

export async function create(
  _newUserData: Omit<EmailPwdUserData, 'created'>,
): Promise<EmailPwdUser> {
  const newUserData: EmailPwdUserData = {
    ..._newUserData,
    created: shell.now().toISOString(),
  }
  const { new: oldUserDoc } = await EmailPwdUserCollection.save(newUserData, { returnNew: true })
  const newUser = _user(oldUserDoc)
  assert(newUser)

  return newUser
}

function _user(user: EmailPwdUserDoc | null | undefined): undefined | EmailPwdUser {
  return user
    ? {
        _key: user._key,
        webUserKey: user.webUserKey,
        created: user.created,
        email: user.email,
        password: user.password,
      }
    : undefined
}
