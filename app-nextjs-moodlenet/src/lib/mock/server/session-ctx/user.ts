import { getAuthToken } from '@/lib-server/auth'
import { user as _user } from '@/lib-server/session/types/user'
import { siteUrls } from 'lib/common/utils/site-urls'

export async function user() {
  const url = siteUrls('http://localhost:3000')
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
