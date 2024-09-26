export interface DeploymentInfo {
  hostname: string
  protocol: string
  port: string
  secure: boolean
  pathname: string
}
export function getDeploymentUrl({ hostname, port, protocol, pathname }: DeploymentInfo) {
  return `${protocol}//${hostname}${port ? `:${port}` : ''}${pathname}`
}
