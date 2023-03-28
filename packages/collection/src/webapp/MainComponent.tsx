import {
  AuthCtx,
  ReactAppContext,
  ReactAppMainComponent,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import { Route } from 'react-router-dom'
import { CollectionFormValues, MyPkgContext, RpcCaller } from '../common/types.mjs'
import { CollectionPageRoute } from '../ui.mjs'
import { MainContext } from './MainContext.js'

const myRoutes = {
  rootPath: '/',
  routes: <Route path="collection/:key" element={<CollectionPageRoute />} />,
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
      edit: (collectionId: string, values: CollectionFormValues): Promise<unknown> =>
        me.rpc['webapp/edit']({ key: collectionId, values }),
      get: (collectionId: string) =>
        me.rpc['webapp/get/:_key'](null, { _key: collectionId }, { page: '-1' }), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
      _delete: (collectionId: string) => me.rpc['webapp/delete'](collectionId),
      toggleFollow: (collectionId: string) => me.rpc['webapp/toggleFollow'](collectionId),
      setIsPublished: (collectionId: string) => me.rpc['webapp/setIsPublished'](collectionId),
      toggleBookmark: (collectionId: string) => me.rpc['webapp/toggleBookmark'](collectionId),
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
