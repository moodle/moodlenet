import { getProfileIdByUsername } from '@moodlenet/common/lib/utils/auth/helpers'
import { SessionEnv, SessionEnvUser } from './types'

export const makeEnv = ({ user }: { user: SessionEnvUser }): SessionEnv => {
  return {
    user,
  }
}

export const SystemSessionEnvUser: SessionEnvUser = {
  role: 'System',
  name: '__SYSTEM__',
}
export const SystemSessionEnv = () => makeEnv({ user: SystemSessionEnvUser })

export const GuestSessionEnvUser: SessionEnvUser = {
  role: 'Guest',
  name: '__GUEST__',
}

export const GuestSessionEnv = () => makeEnv({ user: GuestSessionEnvUser })

export const getProfileId = (env: SessionEnv) => getProfileIdByUsername(env.user.name)

export const isGuest = (env: SessionEnv) => env.user.role === 'Guest'
