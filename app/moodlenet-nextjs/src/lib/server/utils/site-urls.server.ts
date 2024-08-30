import { sitepaths } from '../../common/utils/sitepaths'
import { getAccessProxy } from '../session-access'

export async function srvSiteUrls() {
  const { d } = getAccessProxy()

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
