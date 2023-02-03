import type { PkgIdentifier, RpcArgs } from '@moodlenet/core'
export * from '../types.mjs'
export const SESSION_TOKEN_COOKIE_NAME = 'mn-session'
export const BASE_RPC_URL = '/.rpc'
export const BASE_PKG_URL = '/.pkg'

export function getPkgRpcFetchOpts(
  userPkgId: PkgIdentifier,
  targetPkgId: PkgIdentifier,
  apiPath: string,
  args: RpcArgs,
) {
  const url = `${BASE_RPC_URL}/${targetPkgId.name}/${apiPath}`
  const [bodyArg] = args
  const [method, body, contentType] = getRequestBody(bodyArg)
  const requestInit: RequestInit = {
    method,
    headers: {
      ...(contentType ? { 'Content-Type': contentType } : null),
      'Accept': 'application/json',
      'x-moodlenet-react-app-caller': `${userPkgId.name}@${userPkgId.version}`,
    },
    body,
  }
  return { url, requestInit }
}

function getRequestBody(bodyArg: RpcArgs[0]): [method: string, body?: any, contentType?: string] {
  const hasBody = bodyArg !== undefined
  if (!hasBody) {
    return ['GET', undefined, undefined]
  }
  const hasFiles = hasBodyFiles(bodyArg)

  if (!hasFiles) {
    return ['POST', JSON.stringify(bodyArg), 'application/json']
  } else {
    const formData = new FormData()
    formData.append('.', JSON.stringify(bodyArg))
    return ['POST', formData, undefined]
  }
}

function hasBodyFiles(bodyArg: any) {
  return !!bodyArg
}
