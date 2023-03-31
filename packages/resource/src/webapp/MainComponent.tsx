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
      edit: (key: string, resource: ResourceFormValues) => me.rpc['webapp/edit']({ key, resource }),
      get: (key: string) => me.rpc['webapp/get']({ key: key }),
      _delete: (key: string) => me.rpc['webapp/delete']({ key }),
      setIsPublished: (key: string) => me.rpc['webapp/setIsPublished']({ key }),
      setImage: (key: string, file: File) => me.rpc['webapp/setImage']({ key, file }),
      setContent: (key: string, file: File | string) => me.rpc['webapp/setContent']({ key, file }),
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
