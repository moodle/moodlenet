import { url_string } from '@moodle/lib-types'
import { sitepaths } from '../../common/utils/sitepaths'
import { priAccess } from '../session-access'
import { getDeploymentUrl } from '@moodle/lib-ddd'
import assert from 'assert'

export async function srvSiteUrls() {
  const webappDeploymentInfo =
    await priAccess().moodle.netWebappNextjs.v1_0.pri.webapp.deploymentInfo()
  const baseUrl = getDeploymentUrl(webappDeploymentInfo)

  return {
    full: sitepaths<url_string>(baseUrl),
    site: sitepaths(webappDeploymentInfo.pathname),
  }
}
