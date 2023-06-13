import { platform } from 'os'
import { verifyCurrentTokenCtx } from './exports.mjs'
export function fixModuleLocForWebpackByOS(moduleLoc: string) {
  switch (platform()) {
    case 'win32':
      return moduleLoc.replaceAll('\\', '\\\\')
    default:
      return moduleLoc
  }
}

export async function betterTokenContext() {
  const mTokenCtx = await verifyCurrentTokenCtx()

  if (!mTokenCtx) {
    return {
      isRootOrAdmin: false,
      anon: true,
      currentWebUser: undefined,
    } as const
  } else {
    const isRootOrAdmin =
      !!mTokenCtx && (mTokenCtx.payload.isRoot || mTokenCtx.payload.webUser.isAdmin)
    return {
      isRootOrAdmin,
      anon: false,
      currentWebUser: mTokenCtx.payload,
    } as const
  }
}
