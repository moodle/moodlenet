import { sitepaths } from '../../common/utils/sitepaths'
import { getAccess } from '../session-access'

export async function srvSiteUrls() {
  const access = await getAccess()

  const {
    info: {
      deployment: { basePath, domain, secure },
    },
  } = await access('net', 'read', 'website-info', void 0).val

  const baseUrl = `${secure ? 'https' : 'http'}://${domain}${basePath}`
  return {
    full: sitepaths(baseUrl),
    site: sitepaths(basePath),
  }
}
