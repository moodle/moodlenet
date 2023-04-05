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
import { CollectionPageRoute } from '../ui.mjs'
import { MainContext } from './MainContext.js'

const myRoutes = {
  routes: <Route path="collection/:key" element={<CollectionPageRoute />} />,
}

const addAuthMissing =
  (missing: { isAuthenticated: boolean }) =>
  (rpcCollection: Promise<CollectionRpc>): Promise<CollectionProps> =>
    rpcCollection.then(res => ModelRpcToProps(missing, res))

const toFormRpc = (r: CollectionFormProps): CollectionFormRpc => r
const toFormProps = (r: CollectionFormRpc): CollectionFormProps => r

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
        rpc['webapp/edit']({ key: key, values: toFormRpc(values) }).then(toFormProps),
      get: (_key: string) => addAuth(rpc['webapp/get/:_key']({ _key })), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
      _delete: async (key: string) => addAuth(rpc['webapp/delete']({ key: key })),
      setIsPublished: async (key: string, publish: boolean) =>
        addAuth(rpc['webapp/setIsPublished']({ key: key, publish })),
      setImage: async (key: string, file: File) => addAuth(rpc['webapp/setImage']({ key, file })),
      create: () => addAuth(rpc['webapp/create']()),
      // toggleFollow: (key: string) => me.rpc['webapp/toggleFollow']({ key: key }), // toggleBookmark: (key: string) => me.rpc['webapp/toggleBookmark']({ key: key }),
    }
  }, [auth.access, me.rpc])

  const actionsMenu = useMemo(() => {
    const acCreate = () =>
      rpcCaller.create().then(({ data: { collectionId } }) => nav(`/collection/${collectionId}`))

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
