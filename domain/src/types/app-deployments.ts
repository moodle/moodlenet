import { map, url_string } from '@moodle/lib-types'

export type appDeployments = map<DeploymentInfo, moodleApp>
export type moodleApp = 'moodlenetWebapp' //| 'filestoreHttp'

//FIXME: use URL instead of DeploymentInfo ?!
export interface DeploymentInfo {
  basePath: string
  hostname: string
  port: null | number
  protocol: string
  href: url_string
}
