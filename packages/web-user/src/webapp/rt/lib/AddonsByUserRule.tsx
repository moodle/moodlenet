import type { AddOnMap } from '@moodlenet/core/lib'
import { useContext } from 'react'
import { AuthCtx } from '../exports.mjs'

export type AddonsByUserRule<T> = {
  guest: AddOnMap<T> | undefined
  auth: AddOnMap<T> | undefined
  root?: AddOnMap<T> | undefined
}
export const useSwichAddonsByAuth = <T,>({
  guest,
  auth,
  root,
}: AddonsByUserRule<T>): AddOnMap<T> | undefined => {
  const { isAuthenticated, clientSessionData } = useContext(AuthCtx)
  const isRoot = !!clientSessionData?.isRoot
  const comp = isRoot ? root || undefined : isAuthenticated ? auth : guest
  return comp
}
