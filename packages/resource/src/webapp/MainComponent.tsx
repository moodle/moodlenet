import { authToAccessRpc, ModelRpcToProps } from '@moodlenet/react-app/common'
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
  ResourceFormProps,
  ResourceFormRpc,
  ResourceProps,
  ResourceRpc,
  RpcCaller,
  rpcUrl,
} from '../common/types.mjs'
import { ResourcePageRoute } from './components/pages/Resource/ResourcePageRoute.js'
import { MainContext } from './MainContext.js'

const myRoutes = {
  routes: <Route path="resource/:key" element={<ResourcePageRoute />} />,
}
const addAuthMissing =
  (missing: { isAuthenticated: boolean }) =>
  (rpcResource: Promise<ResourceRpc>): Promise<ResourceProps> =>
    rpcResource.then(res => ModelRpcToProps(missing, res))

const toFormRpc = (r: ResourceFormProps): ResourceFormRpc => r
const toFormProps = (r: ResourceFormRpc): ResourceFormProps => r

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { use } = myPkgCtx
  const { me } = use
  const { registries } = useContext(ReactAppContext)
  const { clientSessionData } = useContext(AuthCtx)

  registries.routes.useRegister(myRoutes)
  const auth = useMemo(() => authToAccessRpc(clientSessionData), [clientSessionData])

  const rpcCaller = useMemo((): RpcCaller => {
    const rpc = me.rpc
    const addAuth = addAuthMissing(auth.access || null)

    const rpcItem: RpcCaller = {
      edit: (key: string, values: ResourceFormProps) =>
        rpc[rpcUrl.edit]({ key, resource: toFormRpc(values) }).then(toFormProps),
      get: (key: string) => addAuth(rpc[rpcUrl.get]({ key })),
      _delete: (key: string) => addAuth(rpc[rpcUrl.delete]({ key })),
      setImage: (key: string, file: File) => addAuth(rpc[rpcUrl.setImage]({ key, file })),
      setContent: (key: string, file: File | string) =>
        addAuth(rpc[rpcUrl.setContent]({ key, file })),
      setIsPublished: (key: string) => addAuth(rpc[rpcUrl.setIsPublished]({ key })),
      // toggleLike: (key: string) => rpc[rpcUrl.toggleLike].fn({ key }),  // toggleBookmark: (key: string) => rpc[rpcUrl.toggleBookmark].fn({ key }),
    }

    return rpcItem
  }, [auth.access, me.rpc])

  const mainValue = {
    ...myPkgCtx,
    rpcCaller,
    auth,
  }

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
}

export default MainComponent
