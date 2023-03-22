import {
  AuthCtx,
  ClientSessionData,
  PkgContextT,
  ReactAppContext,
  ReactAppMainComponent,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import { Route } from 'react-router-dom'
import { ResourceFormValues, RpcCaller } from './common/types.mjs'
import { MainContext } from './MainContext.js'
import { expose as me } from './server/expose.mjs'
import { ResourcePageRoute  } from './ui.mjs'

export type MyWebDeps = { me: typeof me }
export type MyPkgContext = PkgContextT<MyWebDeps>

export type MainContextResourceType = MyPkgContext & {
  rpcCaller: RpcCaller
  auth: {
    clientSessionData: ClientSessionData | null | undefined
  }
}

const myRoutes = { rootPath: 'resource', routes: <Route index element={<ResourcePageRoute />} /> }

export const MainComponent: ReactAppMainComponent = ({ children }) => {
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { registries } = useContext(ReactAppContext)
  registries.routes.useRegister(myRoutes)

  const me = myPkgCtx.use.me
  const { clientSessionData } = useContext(AuthCtx)

  const auth = useMemo(
    () => ({
      isAuthenticated: !!clientSessionData,
      isAdmin: !!clientSessionData?.isAdmin,
      clientSessionData,
    }),
    [clientSessionData],
  )

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

  const mainValue = {
    ...myPkgCtx,
    rpcCaller,
    auth,
  }

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
}
