import type { RpcFile } from '../exports.mjs'

export * from '../lib/hook-plugin-provider.mjs'

export function isRpcFile(rpcFile: any): rpcFile is RpcFile {
  return (
    rpcFile &&
    typeof rpcFile.type === 'string' &&
    typeof rpcFile.name === 'string' &&
    typeof rpcFile.size === 'number'
  )
}
