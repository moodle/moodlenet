import { _nullish, path, url_string_schema } from '@moodle/lib-types'

export interface DeploymentInfo {
  basePath: string
  hostname: string
  port: _nullish | number
  protocol: string
}
export function getDeploymentInfoUrl(
  { hostname, port, protocol, basePath }: DeploymentInfo,
  appendPath: string | path = '',
) {
  appendPath = [appendPath].flat().join('/')
  appendPath = appendPath.length && !appendPath.startsWith('/') ? `/${appendPath}` : appendPath
  return url_string_schema.parse(
    `${protocol}//${hostname}${port ? `:${port}` : ''}${basePath}${appendPath}`,
  )
}

export function deploymentInfoFromUrlString(urlStr: string) {
  const url = new URL(urlStr)
  // const basePath = url.pathname.replace(/[(^\/)(\/$)]/g, '')
  const pathname = url.pathname
  const hostname = url.hostname
  const port = url.port ? parseInt(url.port) : null
  const protocol = url.protocol
  // console.log('env_provider_secondarys_factory', {
  //   url,
  //   pathname,
  //   hostname,
  //   port,
  //   protocol,
  // })

  const info: DeploymentInfo = {
    basePath: pathname,
    hostname,
    port,
    protocol,
  }
  return info
}
