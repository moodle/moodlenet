import { getCurrentSystemUser } from '@moodlenet/system-entities/server'
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

//BEWARE ! this token is valued by webapp only!! e.g. won't be by oauth !!
export async function betterTokenContext() {
  const sysUser = await getCurrentSystemUser()
  if (sysUser.type === 'pkg') {
    return {
      isRootOrAdminOrPkg: true,
      anon: false,
    } as const
  }
  const mTokenCtx = await verifyCurrentTokenCtx()

  if (!mTokenCtx) {
    return {
      isRootOrAdminOrPkg: false,
      anon: true,
      // currentWebUser: undefined,
    } as const
  } else {
    const isRootOrAdminOrPkg =
      !!mTokenCtx && (mTokenCtx.payload.isRoot || mTokenCtx.payload.webUser.isAdmin)
    return {
      isRootOrAdminOrPkg,
      anon: false,
      // currentWebUser: mTokenCtx.payload,
    } as const
  }
}
