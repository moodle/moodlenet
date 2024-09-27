export interface DeploymentInfo {
  basePath: string
  hostname: string
  port: string
  protocol: string
}
export function getDeploymentUrl({ hostname, port, protocol, basePath }: DeploymentInfo) {
  return `${protocol}//${hostname}${port ? `:${port}` : ''}${basePath}`
}
