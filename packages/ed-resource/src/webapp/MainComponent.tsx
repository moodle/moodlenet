import { ReactAppContext, ReactAppMainComponent, usePkgContext } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import { Route } from 'react-router-dom'
import {
  MainContextResource,
  MyPkgContext,
  ResourceFormProps,
  ResourceFormRpc,
  RpcCaller,
} from '../common/types.mjs'
import { RESOURCE_HOME_PAGE_ROUTE_PATH } from '../common/webapp-routes.mjs'
import { ResourcePageRoute } from './components/pages/Resource/ResourcePageRoute.js'
import { MainContext } from './MainContext.js'
import { ResourceContextProvider } from './ResourceContext.js'

const myRoutes = {
  routes: <Route path={RESOURCE_HOME_PAGE_ROUTE_PATH} element={<ResourcePageRoute />} />,
}
// const addAuthMissing =
//   (missing: { isAuthenticated: boolean }) =>
//   (rpcResource: Promise<ResourceRpc | undefined>): Promise<ResourceProps | undefined> =>
//     rpcResource.then(res => res && ModelRpcToProps(missing, res))

const toFormRpc = (r: ResourceFormProps): ResourceFormRpc => r
// const toFormProps = (r: ResourceFormRpc): ResourceFormProps => r

// const menuItems = {
//   create: (onClick: () => void): HeaderMenuItem => ({
//     Icon: '(icon)',
//     text: `New Resource`,
//     key: 'newResource1',
//     onClick,
//   }),
// }

const MainComponent: ReactAppMainComponent = ({ children }) => {
  // const nav = useNavigate()
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const reactAppCtx = useContext(ReactAppContext)
  // const webUserCtx = useContext(AuthCtx)

  reactAppCtx.registries.routes.useRegister(myRoutes)
  // const auth = useMemo(
  //   () => authToAccessRpc(webUserCtx.clientSessionData),
  //   [webUserCtx.clientSessionData],
  // )
  const me = myPkgCtx.use.me

  const rpcCaller = useMemo((): RpcCaller => {
    const rpc = me.rpc
    // const addAuth = addAuthMissing(auth.access || null)

    const rpcItem: RpcCaller = {
      edit: (key: string, values: ResourceFormProps) =>
        rpc['webapp/edit/:_key']({ values: toFormRpc(values) }, { _key: key }),
      get: (key: string) => rpc['webapp/get/:_key'](null, { _key: key }),
      // get: (key: string) => addAuth(rpc['webapp/get/:_key'](null, { _key: key })),
      _delete: (key: string) => rpc['webapp/delete/:_key'](null, { _key: key }),
      setImage: (key: string, file: File | undefined | null) =>
        file
          ? rpc['webapp/upload-image/:_key']({ file: [file] }, { _key: key })
          : Promise.resolve(''), //@ETTO Needs to be fixed
      setContent: (key: string, content: File | string | undefined | null) =>
        content
          ? rpc['webapp/upload-content/:_key']({ content: [content] }, { _key: key })
          : Promise.resolve(''), //@ETTO Needs to be fixed
      setIsPublished: (key, publish) =>
        rpc['webapp/set-is-published/:_key']({ publish }, { _key: key }),
      create: () => rpc['webapp/create'](),
      // toggleLike: (_key: string) => undefined, //rpc[rpcUrl.toggleLike].fn({ key }),  //@ETTO to be filled
      // toggleBookmark: (_key: string) => undefined, //rpc[rpcUrl.toggleBookmark].fn({ key }), //@ETTO to be filled
    }

    return rpcItem
  }, [me.rpc])

  // const actionsMenu = useMemo(() => {
  //   const acCreate = () => rpcCaller.create().then(({ _key }) => nav(`/resource/${_key}`))

  //   return {
  //     create: { action: acCreate, menu: menuItems.create(acCreate) },
  //   }
  // }, [nav, rpcCaller])

  // webUserCtx.registries.addMenuItems.useRegister(actionsMenu.create.menu, {
  //   condition: auth.access.isAuthenticated,
  // })

  const mainValue: MainContextResource = {
    ...myPkgCtx,
    rpcCaller,
    // actionsMenu,
    // auth,
  }

  return (
    <MainContext.Provider value={mainValue}>
      <ResourceContextProvider>{children}</ResourceContextProvider>
    </MainContext.Provider>
  )
}

export default MainComponent
