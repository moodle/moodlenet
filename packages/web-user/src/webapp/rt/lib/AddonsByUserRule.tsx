import type { PkgAddOns } from '@moodlenet/react-app/webapp'
import { useContext } from 'react'
import { AuthCtx } from '../exports.mjs'

export type AddonsByUserRule<T> = {
  guest: PkgAddOns<T> | undefined
  auth: PkgAddOns<T> | undefined
  root?: PkgAddOns<T> | undefined
}
export const useSwichAddonsByAuth = <T,>({
  guest,
  auth,
  root,
}: AddonsByUserRule<T>): PkgAddOns<T> | undefined => {
  const { isAuthenticated, clientSessionData } = useContext(AuthCtx)
  const isRoot = !!clientSessionData?.isRoot
  const comp = isRoot ? root || undefined : isAuthenticated ? auth : guest
  return comp
}
