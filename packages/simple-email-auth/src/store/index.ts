import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { Email, User, UserId, Users } from './types'

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
    getByEmail,
  }

  async function getByEmail(searchEmail: Email): Promise<User | undefined> {
    const users = await read()
    return Object.values(users).find(({ email }) => email === searchEmail)
  }

  async function getById(id: UserId): Promise<User | undefined> {
    const users = await read()
    return users[id]
  }

  async function create(newUser: Omit<User, 'id' | 'created'>): Promise<User> {
    const id = Math.random().toString(36).substring(2)
    const created = new Date().toISOString()
    const user: User = { ...newUser, id, created }
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
    await writeFile(file(), JSON.stringify(users, null, 2))
  }

  function file() {
    return resolve(folder, 'users.json')
  }
}
