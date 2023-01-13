import { query } from '@moodlenet/arangodb'
import assert from 'assert'
import { ProviderId, User, UserId } from './store/types.mjs'

export async function getByProviderId(pId: ProviderId): Promise<User | undefined> {
  const m_user = (
    await query({
      q: `FOR u in User
              FILTER u.providerId == ${JSON.stringify(pId)}
              LIMIT 1
            RETURN u`,
    })
  ).resultSet[0]

  return _user(m_user)
}

export async function getById(id: UserId): Promise<User | undefined> {
  const m_user = (
    await query({
      q: `RETURN DOCUMENT('User/${id}')`,
    })
  ).resultSet[0]

  return _user(m_user)
}

export async function delUser(id: UserId) {
  const m_user = (
    await query({
      q: `REMOVE User/${id} FROM User
            RETURN OLD`,
    })
  ).resultSet[0]

  return _user(m_user)
}

export async function create(newUser: Omit<User, 'id' | 'created'>): Promise<User> {
  const m_user = (
    await query({
      q: `
        INSERT ${JSON.stringify(newUser)} INTO User
        RETURN $NEW`,
    })
  ).resultSet[0]
  const user = _user(m_user)
  assert(user, 'no user after creation !')
  return user
}

function _user(user: any): User | undefined {
  return user
    ? {
        id: user._key,
        created: user.created,
        providerId: user.providerId,
        // displayName: user.displayName,
        // avatarUrl: user.avatarUrl,
      }
    : undefined
}
