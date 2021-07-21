import { ActiveUser } from '../../adapters/user-auth/arangodb/types'
import { GuestSessionEnvUser, SystemSessionEnvUser, UnavailableUserEnvUser } from '../../lib/auth/env'
type InitialUser = Pick<ActiveUser, 'username' | 'email' | 'role' | 'password'>

const rndPass = () => String(Number(`${Math.random()}`.substring(2)).toString(36))

const DefaultAdminUser = ({ domain }: { domain: string }): InitialUser => ({
  username: `admin`,
  password: `admin`,
  email: `info@${domain}`,
  role: `Admin`,
})

const SystemPseudoUser = ({ domain }: { domain: string }): InitialUser => ({
  username: SystemSessionEnvUser.name,
  role: SystemSessionEnvUser.role,
  email: `${SystemSessionEnvUser.name}@${domain}`,
  password: rndPass(),
})

const GuestPseudoUser = (): InitialUser => ({
  username: GuestSessionEnvUser.name,
  role: GuestSessionEnvUser.role,
  email: `${GuestSessionEnvUser.name}@example.com`,
  password: rndPass(),
})

const UnavailablePseudoUser = (): InitialUser => ({
  username: UnavailableUserEnvUser.name,
  role: UnavailableUserEnvUser.role,
  email: `${UnavailableUserEnvUser.name}@example.com`,
  password: rndPass(),
})

export default ({ domain }: { domain: string }) => [
  SystemPseudoUser({ domain }),
  GuestPseudoUser(),
  UnavailablePseudoUser(),
  DefaultAdminUser({ domain }),
]
