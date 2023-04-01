import {
  AuthCtx,
  ReactAppContext,
  ReactAppMainComponent,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import { Route } from 'react-router-dom'
import {
  MyPkgContext,
  ResourceFormValues,
  ResourceMainProps,
  ResourceRpc,
  RpcCaller,
  rpcUrl,
} from '../common/types.mjs'
import { ResourcePageRoute } from './components/pages/Resource/ResourcePageRoute.js'
import { MainContext } from './MainContext.js'

const myRoutes = {
  routes: <Route path="resource/:key" element={<ResourcePageRoute />} />,
}

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { use } = myPkgCtx
  const { me } = use
  const { registries } = useContext(ReactAppContext)
  const { clientSessionData } = useContext(AuthCtx)

  registries.routes.useRegister(myRoutes)
  const auth = useMemo(
    () => ({
      isAuthenticated: !!clientSessionData,
      isAdmin: !!clientSessionData?.isAdmin,
      clientSessionData,
    }),
    [clientSessionData],
  )

  const rpcCaller = useMemo((): RpcCaller => {
    const resourceRpcToProps = (rpcResource: ResourceRpc): ResourceMainProps => ({
      ...rpcResource,
      access: { ...rpcResource.access, isAuthenticated: auth.isAuthenticated },
    })
    const addAuth = (rpcResource: Promise<ResourceRpc>): Promise<ResourceMainProps> =>
      rpcResource.then(resourceRpcToProps)
    const rpc = me.rpc

    const rpcWeb = {
      edit: (key: string, resource: ResourceFormValues) => rpc[rpcUrl.edit]({ key, resource }),
      get: (key: string) => rpc[rpcUrl.get]({ key }).then(resourceRpcToProps),
      _delete: (key: string) => addAuth(rpc[rpcUrl.delete]({ key })),
      setImage: (key: string, file: File) => addAuth(rpc[rpcUrl.setImage]({ key, file })),
      setContent: (key: string, file: File | string) =>
        addAuth(rpc[rpcUrl.setContent]({ key, file })),
      setIsPublished: (key: string) => addAuth(rpc[rpcUrl.setIsPublished]({ key })),
      // toggleLike: (key: string) => rpc[rpcUrl.toggleLike].fn({ key }),  // toggleBookmark: (key: string) => rpc[rpcUrl.toggleBookmark].fn({ key }),
    }

    return rpcWeb
  }, [auth.isAuthenticated, me.rpc])

  const mainValue = {
    ...myPkgCtx,
    rpcCaller,
    auth,
  }

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
}

export default MainComponent
