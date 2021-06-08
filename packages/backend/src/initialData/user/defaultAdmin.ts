import { ActiveUser } from '../../adapters/user-auth/arangodb/types'

export const DefaultAdminUser = (): Pick<
  ActiveUser,
  'username' | 'email' | 'role' | 'firstActivationToken' | 'password'
> => {
  return {
    username: 'admin',
    password: 'admin',
    email: 'info@moodle.net',
    role: 'Admin',
    firstActivationToken: undefined,
  }
}
