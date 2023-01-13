import type { PkgIdentifier } from '@moodlenet/core'
export * from '../types.mjs'
export const SESSION_TOKEN_COOKIE_NAME = 'mn-session'
export const BASE_RPC_URL = '/.rpc'
export const BASE_PKG_URL = '/.pkg'

export function getPkgRpcFetchOpts(
  userPkgId: PkgIdentifier,
  targetPkgId: PkgIdentifier,
  apiPath: string,
  args?: unknown[],
) {
  const url = `${BASE_RPC_URL}/${targetPkgId.name}/${targetPkgId.version}/${apiPath}`
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-moodlenet-react-app-caller': `${userPkgId.name}@${userPkgId.version}`,
    },
    body: JSON.stringify({ args }),
  }
  return { url, requestInit }
}
