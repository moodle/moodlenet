import {
  AuthCtx,
  ReactAppContext,
  ReactAppMainComponent,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import { Route } from 'react-router-dom'
import { MyPkgContext, ResourceFormValues, RpcCaller } from '../common/types.mjs'
import { ResourcePageRoute } from './components/pages/Resource/ResourcePageRoute.js'
import { MainContext } from './MainContext.js'

const myRoutes = {
  routes: (
    <>
      <Route path="resource/:key" element={<ResourcePageRoute />} />
    </>
  ),
}

const MainComponent: ReactAppMainComponent = ({ children }) => {
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
      setIsPublished: (resourceKey: string) => me.rpc['webapp/setIsPublished'](resourceKey),
      // toggleBookmark: (resourceKey: string) => me.rpc['webapp/toggleBookmark'](resourceKey),
      // toggleLike: (resourceKey: string) => me.rpc['webapp/toggleLike'](resourceKey),
    }
  }, [me.rpc])

  const mainValue = {
    ...myPkgCtx,
    rpcCaller: rpcCaller,
    auth,
  }

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
}

export default MainComponent
