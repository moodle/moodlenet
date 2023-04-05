import { authToAccessRpc, ModelRpcToProps } from '@moodlenet/react-app/common'
import { HeaderMenuItem } from '@moodlenet/react-app/ui'
import {
  AuthCtx,
  ReactAppContext,
  ReactAppMainComponent,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import { Route, useNavigate } from 'react-router-dom'
import {
  MyPkgContext,
  ResourceFormProps,
  ResourceFormRpc,
  ResourceProps,
  ResourceRpc,
  RpcCaller,
} from '../common/types.mjs'
import { RESOURCE_HOME_PAGE_ROUTE_PATH } from '../common/webapp-routes.mjs'
import { ResourcePageRoute } from './components/pages/Resource/ResourcePageRoute.js'
import { MainContext } from './MainContext.js'

const myRoutes = {
  routes: <Route path={RESOURCE_HOME_PAGE_ROUTE_PATH} element={<ResourcePageRoute />} />,
}
const addAuthMissing =
  (missing: { isAuthenticated: boolean }) =>
  (rpcResource: Promise<ResourceRpc | undefined>): Promise<ResourceProps | undefined> =>
    rpcResource.then(res => res && ModelRpcToProps(missing, res))

const toFormRpc = (r: ResourceFormProps): ResourceFormRpc => r
// const toFormProps = (r: ResourceFormRpc): ResourceFormProps => r

const menuItems = {
  create: (onClick: () => void): HeaderMenuItem => ({
    Icon: '(icon)',
    text: `New Resource`,
    key: 'newResource1',
    onClick,
  }),
}

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const nav = useNavigate()
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { registries } = useContext(ReactAppContext)
  const { clientSessionData } = useContext(AuthCtx)

  registries.routes.useRegister(myRoutes)
  const auth = useMemo(() => authToAccessRpc(clientSessionData), [clientSessionData])
  const me = myPkgCtx.use.me

  const rpcCaller = useMemo((): RpcCaller => {
    const rpc = me.rpc
    const addAuth = addAuthMissing(auth.access || null)

    const rpcItem: RpcCaller = {
      edit: (key: string, values: ResourceFormProps) =>
        rpc['webapp/edit/:_key']({ values: toFormRpc(values) }, { _key: key }),
      get: (key: string) => addAuth(rpc['webapp/get/:_key'](null, { _key: key })),
      _delete: (key: string) => rpc['webapp/delete/:_key'](null, { _key: key }),
      setImage: (key: string, file: File) =>
        rpc['webapp/upload-image/:_key']({ file: [file] }, { _key: key }),
      setContent: (key: string, content: File | string) =>
        rpc['webapp/upload-content/:_key']({ content: [content] }, { _key: key }),
      setIsPublished: (key, publish) =>
        rpc['webapp/set-is-published/:_key']({ publish }, { _key: key }),
      create: () => rpc['webapp/create'](),
      // toggleLike: (key: string) => rpc[rpcUrl.toggleLike].fn({ key }),  // toggleBookmark: (key: string) => rpc[rpcUrl.toggleBookmark].fn({ key }),
    }

    return rpcItem
  }, [auth.access, me.rpc])

  const actionsMenu = useMemo(() => {
    const acCreate = () => rpcCaller.create().then(({ _key }) => nav(`/resource/${_key}`))

    return {
      create: { action: acCreate, menu: menuItems.create(acCreate) },
    }
  }, [nav, rpcCaller])

  registries.addMenuItems.useRegister(actionsMenu.create.menu, {
    condition: auth.access.isAuthenticated,
  })
  registries.routes.useRegister(myRoutes)

  const mainValue = {
    ...myPkgCtx,
    rpcCaller,
    actionsMenu,
    auth,
  }

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
}

export default MainComponent
