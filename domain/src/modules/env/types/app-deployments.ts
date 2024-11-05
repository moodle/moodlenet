import { _nullish, map, url_string } from '@moodle/lib-types'

export type appDeployments = map<DeploymentInfo, moodleApp>
export type moodleApp = 'moodlenetWebapp' | 'filestoreHttp'

export interface DeploymentInfo {
  basePath: string
  hostname: string
  port: _nullish | number
  protocol: string
  href: url_string
}
