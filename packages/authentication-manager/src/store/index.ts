import { ExtShell } from '@moodlenet/core'
import { AuthenticationManagerExt } from '..'
import { ProviderId, User, UserId } from './types'

export default function userStore({ shell }: { shell: ExtShell<AuthenticationManagerExt> }) {
  const [, arango] = shell.deps
  return {
    create,
    getById,
    getByProviderId,
    delUser,
  }

  async function getByProviderId(pId: ProviderId): Promise<User | undefined> {
    const user = (
      await arango.access.fetch('query')({
        q: `FOR u in User
              FILTER u.providerId == ${JSON.stringify(pId)}
              LIMIT 1
            RETURN u`,
      })
    ).msg.data.resultSet[0]

    return _user(user)
  }

  async function getById(id: UserId): Promise<User | undefined> {
    const user = (
      await arango.access.fetch('query')({
        q: `RETURN DOCUMENT('User/${id}')`,
      })
    ).msg.data.resultSet[0]

    return _user(user)
  }

  async function delUser(id: UserId) {
    const user = (
      await arango.access.fetch('query')({
        q: `REMOVE User/${id} FROM User
            RETURN OLD`,
      })
    ).msg.data.resultSet[0]

    return _user(user)
  }

  async function create(newUser: Omit<User, 'id' | 'created'>): Promise<User> {
    const user = (
      await arango.access.fetch('query')({
        q: `
        INSERT ${JSON.stringify(newUser)} INTO User
        RETURN $NEW`,
      })
    ).msg.data.resultSet[0]
    return _user(user)!
  }
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
