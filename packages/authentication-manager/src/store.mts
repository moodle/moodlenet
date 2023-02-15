import { queryRs } from '@moodlenet/arangodb'
import assert from 'assert'
import shell from './shell.mjs'
import { ProviderId, User, UserData, UserId } from './store/types.mjs'

export async function getByProviderId(providerId: ProviderId): Promise<User | undefined> {
  const m_user = (
    await shell.call(queryRs)({
      q: `FOR u in User
              FILTER u.providerId == @providerId
              LIMIT 1
            RETURN u`,
      bindVars: { providerId },
    })
  ).resultSet[0]

  return _user(m_user)
}

export async function getById(id: UserId): Promise<User | undefined> {
  const m_user = (
    await shell.call(queryRs)({
      q: `RETURN DOCUMENT(@_id)`,
      bindVars: { _id: _id(id) },
    })
  ).resultSet[0]

  return _user(m_user)
}

export async function delUser(id: UserId) {
  const m_user = (
    await shell.call(queryRs)({
      q: `REMOVE @id FROM User
            RETURN OLD`,
      bindVars: { id: _id(id) },
    })
  ).resultSet[0]

  return _user(m_user)
}

export async function modUser(id: UserId, modUser: Partial<User>) {
  const m_user = (
    await shell.call(queryRs)({
      q: `UPDATE @id WITH @modUser FROM User
            RETURN OLD`,
      bindVars: { id: _id(id), modUser },
    })
  ).resultSet[0]

  return _user(m_user)
}

export async function create(newUser: Omit<UserData, 'created'>): Promise<User> {
  const m_user = (
    await shell.call(queryRs)({
      q: `
        let newUser = MERGE(@newUser, { created: DATE_ISO8601(DATE_NOW()) })
        INSERT newUser INTO User
        RETURN $NEW`,
      bindVars: { newUser },
    })
  ).resultSet[0]
  const user = _user(m_user)
  assert(user, 'no user after creation !')
  return user
}

function _user(userDoc: any): User | undefined {
  return userDoc
    ? {
        id: userDoc._key,
        created: userDoc.created,
        providerId: userDoc.providerId,
      }
    : undefined
}

function _id(_of: string | User) {
  const key = 'string' === typeof _of ? _of : _of.id
  return `User/${key}`
}
