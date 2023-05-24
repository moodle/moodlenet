import type { PkgAddOns } from '@moodlenet/react-app/webapp'
import { useContext } from 'react'
import { AuthCtx } from '../exports.mjs'

export type AddonsByUserRule<T> = {
  guest: PkgAddOns<T> | null
  auth: PkgAddOns<T> | null
  root?: PkgAddOns<T> | null
}
export const useSwichAddonsByAuth = <T,>({
  guest,
  auth,
  root,
}: AddonsByUserRule<T>): PkgAddOns<T> | null => {
  const { isAuthenticated, clientSessionData } = useContext(AuthCtx)
  const isRoot = !!clientSessionData?.isRoot
  const comp = isRoot ? root || null : isAuthenticated ? auth : guest
  return comp
}
