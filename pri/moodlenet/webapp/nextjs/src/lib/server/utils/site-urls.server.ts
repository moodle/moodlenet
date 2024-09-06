import { sitepaths } from '../../common/utils/sitepaths'
import { getMod } from '../session-access'

export async function srvSiteUrls() {
  const {
    moodle: {
      net: {
        v0_1: { pri: net },
      },
    },
  } = getMod()

  const {
    configs: {
      deployment: { basePath, domain, secure },
    },
  } = await net.configs.read()

  const baseUrl = `${secure ? 'https' : 'http'}://${domain}${basePath}`
  return {
    full: sitepaths(baseUrl),
    site: sitepaths(basePath),
  }
}
