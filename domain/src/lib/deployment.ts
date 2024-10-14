import { url_string_schema } from '@moodle/lib-types'
import { DeploymentInfo } from '../modules/env/types'

//FIXME: use URL !
export function getDeploymentInfoUrl(
  { hostname, port, protocol, basePath }: DeploymentInfo,
  appendPath: string | string[] = '',
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
    href: url_string_schema.parse(url.href),
  }
  return info
}
