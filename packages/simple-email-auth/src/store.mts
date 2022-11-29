import assert from 'assert'
import { Email, User, UserId } from './store/types.mjs'
import { arangoPkg } from './use-pkg-apis.mjs'

await arangoPkg.api('ensureCollections')({ defs: { User: { kind: 'node' } } })

export async function getByEmail(email: Email): Promise<User | undefined> {
  const {
    resultSet: [user],
  } = await arangoPkg.api('query')({
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
  } = await arangoPkg.api('query')({
    q: `RETURN DOCUMENT('User/${id}')`,
  })

  return _user(user)
}

export async function delUser(id: UserId) {
  const {
    resultSet: [user],
  } = await arangoPkg.api('query')({
    q: `REMOVE User/${id} FROM User
        RETURN OLD`,
  })
  return _user(user)
}

export async function create(newUserData: Omit<User, 'id' | 'created'>): Promise<User> {
  const {
    resultSet: [newUser],
  } = await arangoPkg.api('query')({
    q: `
        INSERT ${JSON.stringify(newUserData)} INTO User
        RETURN NEW`,
  })
  const user = _user(newUser)
  assert(user)
  return user
}

function _user(user: any): undefined | User {
  return user
    ? {
        id: user._key,
        created: user.created,
        email: user.email,
        password: user.password,
      }
    : undefined
}
