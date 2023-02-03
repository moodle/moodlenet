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
  const [body] = args
  const url = `${BASE_RPC_URL}/${targetPkgId.name}/${apiPath}`
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-moodlenet-react-app-caller': `${userPkgId.name}@${userPkgId.version}`,
    },
    body: JSON.stringify(body),
  }
  return { url, requestInit }
}
