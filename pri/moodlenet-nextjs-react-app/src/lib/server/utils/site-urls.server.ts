import { getDeploymentInfoUrl } from '@moodle/domain/lib'
import { url_string } from '@moodle/lib-types'
import assert from 'assert'
import { createRoutes } from '../../common/appRoutes'
import { access } from '../session-access'

export async function srvSiteRoutes() {
  const { moodlenetWebapp } = await access.primary.env.application.deployments()
  assert(moodlenetWebapp, new Error('No deployment info for moodlenet !'))
  const baseUrl = getDeploymentInfoUrl(moodlenetWebapp)

  return {
    baseUrl,
    full: createRoutes<url_string>(baseUrl),
    site: createRoutes(moodlenetWebapp.basePath.replace(/^\//, '')),
  }
}

//
//-REVIEW improve check and argument typing
// export async function getIfIsUrlOnThisSite(any_obj: unknown) {
//   const urlString = String(any_obj)
//   const baseUrl = (await srvSiteUrls()).baseUrl
//   const isIt = urlString.startsWith(baseUrl)

//   return isIt ? urlString : null
// }

// export async function getInSiteReferer() {
//   return getIfIsUrlOnThisSite(headers().get('referer'))
// }
