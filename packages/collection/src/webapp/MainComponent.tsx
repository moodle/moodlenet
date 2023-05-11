import type { ReactAppMainComponent } from '@moodlenet/react-app/webapp'
import { ReactAppContext, usePkgContext } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import { Route } from 'react-router-dom'
import type {
  CollectionFormProps,
  CollectionFormRpc,
  MainContextCollection,
  MyPkgContext,
  RpcCaller,
} from '../common/types.mjs'
import { COLLECTION_HOME_PAGE_ROUTE_PATH } from '../common/webapp-routes.mjs'
import { CollectionContextProvider } from './CollectionContext.js'
import { CollectionPageRoute } from './exports/ui.mjs'
import { MainContext } from './MainContext.js'

const myRoutes = {
  routes: <Route path={COLLECTION_HOME_PAGE_ROUTE_PATH} element={<CollectionPageRoute />} />,
}

// const addAuthMissing =
//   (missing: { isAuthenticated: boolean }) =>
//   (rpcCollection: Promise<CollectionRpc | undefined>): Promise<CollectionProps | undefined> =>
//     rpcCollection.then(res => res && ModelRpcToProps(missing, res))

const toFormRpc = (r: CollectionFormProps): CollectionFormRpc => r

// const menuItems = {
//   create: (onClick: () => void): HeaderMenuItem => ({
//     Icon: '(icon)',
//     text: `New collection`,
//     key: 'mykey',
//     onClick,
//   }),
// }

const MainComponent: ReactAppMainComponent = ({ children }) => {
  // const nav = useNavigate()
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const reactAppCtx = useContext(ReactAppContext)
  // const webUserCtx = useContext(AuthCtx)

  const me = myPkgCtx.use.me
  // const auth = useMemo(
  //   () => authToAccessRpc(webUserCtx.clientSessionData),
  //   [webUserCtx.clientSessionData],
  // )

  const rpcCaller = useMemo((): RpcCaller => {
    // const addAuth = addAuthMissing(auth.access || null)
    const rpc = me.rpc

    return {
      collectionsResorce: (containingResourceKey: string) =>
        rpc['webapp/my-collections/:containingResourceKey'](null, { containingResourceKey }),

      actionResorce: (collectionKey: string, action: 'remove' | 'add', resourceKey: string) =>
        rpc['webapp/content/:collectionKey/:action/:resourceKey'](null, {
          collectionKey,
          action,
          resourceKey,
        }),

      edit: (key: string, values: CollectionFormProps) =>
        rpc['webapp/edit/:_key']({ values: toFormRpc(values) }, { _key: key }),

      get: (_key: string) => rpc['webapp/get/:_key'](null, { _key }), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
      // get: (_key: string) => addAuth(rpc['webapp/get/:_key'](null, { _key })), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string

      _delete: async (key: string) => rpc['webapp/delete/:_key'](null, { _key: key }),

      setIsPublished: async (key: string, publish: boolean) =>
        rpc['webapp/set-is-published/:_key']({ publish }, { _key: key }),

      setImage: async (key: string, file: File | null | undefined) =>
        rpc['webapp/upload-image/:_key']({ file: [file] }, { _key: key }), //@ETTO Needs to be fixed

      create: () => rpc['webapp/create'](),
    }
  }, [me.rpc])

  // const actionsMenu = useMemo(() => {
  //   const acCreate = () => rpcCaller.create().then(({ _key }) => nav(`/collection/${_key}`))

  //   return {
  //     create: { action: acCreate, menu: menuItems.create(acCreate) },
  //   }
  // }, [nav, rpcCaller])

  // webUserCtx.registries.addMenuItems.useRegister(actionsMenu.create.menu, {
  //   condition: auth.access.isAuthenticated,
  // })
  reactAppCtx.registries.routes.useRegister(myRoutes)

  const mainValue: MainContextCollection = {
    ...myPkgCtx,
    rpcCaller: rpcCaller,
    // actionsMenu,
    // auth,
  }

  return (
    <MainContext.Provider value={mainValue}>
      {' '}
      <CollectionContextProvider>{children}</CollectionContextProvider>
    </MainContext.Provider>
  )
}

export default MainComponent
