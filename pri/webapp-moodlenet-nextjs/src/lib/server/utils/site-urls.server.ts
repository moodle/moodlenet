import { getDeploymentInfoUrl } from '@moodle/lib-ddd'
import { url_string } from '@moodle/lib-types'
import assert from 'assert'
import { headers } from 'next/headers'
import { createSitepaths } from '../../common/utils/sitepaths'
import { priAccess } from '../session-access'

export async function srvSiteUrls() {
  const { moodlenetWebapp } = await priAccess().env.application.deployments()
  assert(moodlenetWebapp, new Error('No deployment info for moodlenet !'))
  const baseUrl = getDeploymentInfoUrl(moodlenetWebapp)

  return {
    baseUrl,
    full: createSitepaths<url_string>(baseUrl),
    site: createSitepaths(moodlenetWebapp.basePath),
  }
}
//REVIEW improve check and argument typing
export async function getIfIsUrlOnThisSite(any_obj: unknown) {
  const urlString = String(any_obj)
  const baseUrl = (await srvSiteUrls()).baseUrl
  const isIt = urlString.startsWith(baseUrl)
  // console.log('getIfIsUrlOnThisSite', { any_obj, urlString, isIt, baseUrl })
  return isIt ? urlString : null
}

export async function getInSiteReferer() {
  return getIfIsUrlOnThisSite(headers().get('referer'))
}
