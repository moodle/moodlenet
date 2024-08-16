import { sitepaths } from '@/lib/common/utils/sitepaths'
import { getAuthToken } from '@/lib/server/auth'
import { user as _user } from '@/lib/server/session/types/user'

export async function currentUser() {
  const url = sitepaths('http://localhost:3000')
  const authToken = await getAuthToken()
  if (!authToken || authToken === 'guest') {
    const user: _user = { t: 'guest' }
    return user
  }
  const user: _user = {
    t: 'authenticated',
    avatarUrl: '',
    displayName: 'Test User',
    homePage: url.homepages.profile(authToken),
  }
  return user
}
