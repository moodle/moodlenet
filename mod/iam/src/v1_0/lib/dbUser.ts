import { DbUser, UserData } from '../types'

export function dbUser2UserData(dbUser: Pick<DbUser, keyof UserData>): UserData {
  return {
    id: dbUser.id,
    createdAt: dbUser.createdAt,
    contacts: dbUser.contacts,
    displayName: dbUser.displayName,
    roles: dbUser.roles,
  }
}
