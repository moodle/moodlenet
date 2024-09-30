import { getDeploymentUrl } from '@moodle/lib-ddd'
import { url_string } from '@moodle/lib-types'
import { headers } from 'next/headers'
import { sitepaths } from '../../common/utils/sitepaths'
import { priAccess } from '../session-access'
import assert from 'assert'

export async function srvSiteUrls() {
  // headers().
  const webappDeploymentInfo = await priAccess().env.deployments.info('moodlenet')
  assert(webappDeploymentInfo, new Error('No deployment info for moodlenet !'))
  const baseUrl = getDeploymentUrl(webappDeploymentInfo)

  return {
    baseUrl,
    full: sitepaths<url_string>(baseUrl),
    site: sitepaths(webappDeploymentInfo.basePath),
  }
}
//REVIEW improve check and argument typing
export async function getIfIsUrlOnThisSite(any_obj: unknown) {
  const urlString = String(any_obj)
  const baseUrl = (await srvSiteUrls()).baseUrl
  const isIt = urlString.startsWith(baseUrl)
  console.log('getIfIsUrlOnThisSite', { any_obj, urlString, isIt, baseUrl })
  return isIt ? urlString : null
}

export async function getInSiteReferer() {
  return getIfIsUrlOnThisSite(headers().get('referer'))
}
