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
  CollectionFormProps,
  CollectionFormRpc,
  CollectionProps,
  CollectionRpc,
  MainContextCollection,
  MyPkgContext,
  RpcCaller,
} from '../common/types.mjs'
import { COLLECTION_HOME_PAGE_ROUTE_PATH } from '../common/webapp-routes.mjs'
import { CollectionPageRoute } from '../ui.mjs'
import { MainContext } from './MainContext.js'

const myRoutes = {
  routes: <Route path={COLLECTION_HOME_PAGE_ROUTE_PATH} element={<CollectionPageRoute />} />,
}

const addAuthMissing =
  (missing: { isAuthenticated: boolean }) =>
  (rpcCollection: Promise<CollectionRpc | undefined>): Promise<CollectionProps | undefined> =>
    rpcCollection.then(res => res && ModelRpcToProps(missing, res))

const toFormRpc = (r: CollectionFormProps): CollectionFormRpc => r
// const toFormProps = (r: CollectionFormRpc): CollectionFormProps => r

const menuItems = {
  create: (onClick: () => void): HeaderMenuItem => ({
    Icon: '(icon)',
    text: `New collection`,
    key: 'mykey',
    onClick,
  }),
}

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const nav = useNavigate()
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { registries } = useContext(ReactAppContext)
  const { clientSessionData } = useContext(AuthCtx)

  const me = myPkgCtx.use.me
  const auth = useMemo(() => authToAccessRpc(clientSessionData), [clientSessionData])

  const rpcCaller = useMemo((): RpcCaller => {
    const addAuth = addAuthMissing(auth.access || null)
    const rpc = me.rpc

    return {
      edit: (key: string, values: CollectionFormProps) =>
        rpc['webapp/edit/:_key']({ values: toFormRpc(values) }, { _key: key }),
      get: (_key: string) => addAuth(rpc['webapp/get/:_key'](null, { _key })), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
      _delete: async (key: string) => rpc['webapp/delete/:_key'](null, { _key: key }),
      setIsPublished: async (key: string, publish: boolean) =>
        rpc['webapp/set-is-published/:_key']({ publish }, { _key: key }),
      setImage: async (key: string, file: File) =>
        rpc['webapp/upload-image/:_key']({ file: [file] }, { _key: key }),
      create: () => rpc['webapp/create'](),
      // toggleFollow: (key: string) => me.rpc['webapp/toggleFollow']({ key: key }), // toggleBookmark: (key: string) => me.rpc['webapp/toggleBookmark']({ key: key }),
    }
  }, [auth.access, me.rpc])

  const actionsMenu = useMemo(() => {
    const acCreate = () => rpcCaller.create().then(({ _key }) => nav(`/collection/${_key}`))

    return {
      create: { action: acCreate, menu: menuItems.create(acCreate) },
    }
  }, [nav, rpcCaller])

  registries.addMenuItems.useRegister(actionsMenu.create.menu, {
    condition: auth.access.isAuthenticated,
  })
  registries.routes.useRegister(myRoutes)

  const mainValue: MainContextCollection = {
    ...myPkgCtx,
    rpcCaller: rpcCaller,
    actionsMenu,
    auth,
  }

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
}

export default MainComponent
