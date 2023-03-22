import { AuthCtx, usePkgContext } from '@moodlenet/react-app/web-lib'
import { createContext, useContext, useMemo } from 'react'
import {
  MainContextResourceType,
  MyPkgContext,
  ResourceFormValues,
  RpcCaller,
} from '../common/types.mjs'

export const useMainContext = (): MainContextResourceType => {
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { clientSessionData } = useContext(AuthCtx)

  const auth = useMemo(
    () => ({
      isAuthenticated: !!clientSessionData,
      isAdmin: !!clientSessionData?.isAdmin,
      clientSessionData,
    }),
    [clientSessionData],
  )

  const me = myPkgCtx.use.me
  const rpcCaller = useMemo((): RpcCaller => {
    return {
      edit: (resourceKey: string, res: ResourceFormValues) =>
        me.rpc['webapp/edit'](resourceKey, res),
      get: (resourceKey: string) => me.rpc['webapp/get']({ param: resourceKey }),
      _delete: (resourceKey: string) => me.rpc['webapp/delete'](resourceKey),
      toggleBookmark: (resourceKey: string) => me.rpc['webapp/toggleBookmark'](resourceKey),
      toggleLike: (resourceKey: string) => me.rpc['webapp/toggleLike'](resourceKey),
      setIsPublished: (resourceKey: string) => me.rpc['webapp/setIsPublished'](resourceKey),
    }
  }, [me.rpc])

  return {
    ...myPkgCtx,
    rpcCaller,
    auth,
  }
}
