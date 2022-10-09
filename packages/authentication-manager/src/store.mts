import { ProviderId, User, UserId } from './store/types.mjs'
import { arangoPkg } from './use-pkg-apis.mjs'

export async function getByProviderId(pId: ProviderId): Promise<User | undefined> {
  const user = (
    await arangoPkg.api('query')({
      q: `FOR u in User
              FILTER u.providerId == ${JSON.stringify(pId)}
              LIMIT 1
            RETURN u`,
    })
  ).resultSet[0]

  return _user(user)
}

export async function getById(id: UserId): Promise<User | undefined> {
  const user = (
    await arangoPkg.api('query')({
      q: `RETURN DOCUMENT('User/${id}')`,
    })
  ).resultSet[0]

  return _user(user)
}

export async function delUser(id: UserId) {
  const user = (
    await arangoPkg.api('query')({
      q: `REMOVE User/${id} FROM User
            RETURN OLD`,
    })
  ).resultSet[0]

  return _user(user)
}

export async function create(newUser: Omit<User, 'id' | 'created'>): Promise<User> {
  const user = (
    await arangoPkg.api('query')({
      q: `
        INSERT ${JSON.stringify(newUser)} INTO User
        RETURN $NEW`,
    })
  ).resultSet[0]
  return _user(user)!
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
