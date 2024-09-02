import { sitepaths } from '../../common/utils/sitepaths'
import { getMod } from '../session-access'

export async function srvSiteUrls() {
  const {
    moodle: {
      net: {
        V0_1: { pri: net },
      },
    },
  } = getMod()

  const {
    deployment: { basePath, domain, secure },
  } = await net.website.info()

  const baseUrl = `${secure ? 'https' : 'http'}://${domain}${basePath}`
  return {
    full: sitepaths(baseUrl),
    site: sitepaths(basePath),
  }
}
