import { Email, User, UserId } from './store/types.mjs'
import { arangoPkgApis } from './use-pkg-apis.mjs'

await arangoPkgApis('ensureCollections')({ defs: { User: { kind: 'node' } } })

export async function getByEmail(email: Email): Promise<User | undefined> {
  const {
    resultSet: [user],
  } = await arangoPkgApis('query')({
    q: `FOR u in User
          FILTER u.email == '${email}'
          LIMIT 1
        RETURN u`,
  })

  return _user(user)
}

export async function getById(id: UserId): Promise<User | undefined> {
  const {
    resultSet: [user],
  } = await arangoPkgApis('query')({
    q: `RETURN DOCUMENT('User/${id}')`,
  })

  return _user(user)
}

export async function delUser(id: UserId) {
  const {
    resultSet: [user],
  } = await arangoPkgApis('query')({
    q: `REMOVE User/${id} FROM User
        RETURN OLD`,
  })
  return _user(user)
}

export async function create(newUser: Omit<User, 'id' | 'created'>): Promise<User> {
  const {
    resultSet: [user],
  } = await arangoPkgApis('query')({
    q: `
        INSERT ${JSON.stringify(newUser)} INTO User
        RETURN NEW`,
  })
  return _user(user)!
}

function _user(user: any): User | undefined {
  return user
    ? {
        id: user._key,
        created: user.created,
        email: user.email,
        password: user.password,
      }
    : undefined
}
