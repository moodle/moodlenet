import { MNArangoDBExt } from '@moodlenet/arangodb'
import { Shell } from '@moodlenet/core'
import { AuthenticationManagerExt } from '..'
import { ProviderId, User, UserId } from './types'

export default function userStore({ shell }: { shell: Shell<AuthenticationManagerExt> }) {
  const query = shell.access<MNArangoDBExt>('@moodlenet/arangodb@0.1.0').fetch('query')
  return {
    // read,
    // patchUsers,
    // file,
    // write,
    create,
    getById,
    getByProviderId,
    delUser,
  }

  async function getByProviderId(pId: ProviderId): Promise<User | undefined> {
    const user = (
      await query({
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
      await query({
        q: `RETURN DOCUMENT('User/${id}')`,
      })
    ).msg.data.resultSet[0]

    return _user(user)
  }

  async function delUser(id: UserId) {
    const user = (
      await query({
        q: `REMOVE User/${id} FROM User
            RETURN $OLD`,
      })
    ).msg.data.resultSet[0]

    return _user(user)
  }

  async function create(newUser: Omit<User, 'id' | 'created'>): Promise<User> {
    const user = (
      await query({
        q: `
        INSERT ${JSON.stringify(newUser)} INTO User
        RETURN $NEW`,
      })
    ).msg.data.resultSet[0]
    return _user(user)!
  }

  // async function read(): Promise<Users> {
  //   return JSON.parse(await readFile(file(), 'utf-8'))
  // }

  // async function patchUsers(patch: Users) {
  //   const currUsers = await read()
  //   const patchedUsers = { ...currUsers, ...patch }
  //   await write(patchedUsers)
  //   return patchedUsers
  // }

  // async function write(users: Users) {
  //   await writeFile(file(), JSON.stringify(users, null, 2))
  // }

  // function file() {
  //   return resolve(folder, 'users.json')
  // }
}

function _user(user: any): User | undefined {
  return user
    ? {
        id: user._key,
        created: user.created,
        displayName: user.displayName,
        providerId: user.providerId,
        avatarUrl: user.avatarUrl,
      }
    : undefined
}
