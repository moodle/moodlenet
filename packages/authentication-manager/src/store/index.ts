import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { User, UserId, Users } from './types'

export default function userStore({ folder }: { folder: string }) {
  mkdirSync(folder, { recursive: true })

  if (!existsSync(file())) {
    write({})
  }

  return {
    read,
    patchUsers,
    file,
    write,
    create,
    getById,
  }

  async function getById(id: UserId): Promise<User | undefined> {
    const users = await read()
    return users[id]
  }

  async function create(newUser: Omit<User, 'id'>): Promise<User> {
    const id = Math.random().toString(36).substring(2)
    const user: User = { id, ...newUser }
    await patchUsers({ [id]: user })
    return user
  }

  async function read(): Promise<Users> {
    return JSON.parse(await readFile(file(), 'utf-8'))
  }

  async function patchUsers(patch: Users) {
    const currUsers = await read()
    const patchedUsers = { ...currUsers, ...patch }
    await write(patchedUsers)
    return patchedUsers
  }

  async function write(users: Users) {
    await writeFile(file(), JSON.stringify(users))
  }

  function file() {
    return resolve(folder, 'users.json')
  }
}
