import { sitepaths } from '../../common/utils/sitepaths'
import { priAccess } from '../session-access'

export async function srvSiteUrls() {
  const {
    moodle: {
      netWebappNextjs: {
        v1_0: { pri: app },
      },
    },
  } = priAccess()

  const {
    nextjs: {
      deployment: { basePath, domain, secure },
    },
  } = await app.configs.read()

  const baseUrl = `${secure ? 'https' : 'http'}://${domain}${basePath}`
  return {
    full: sitepaths(baseUrl),
    site: sitepaths(basePath),
  }
}
