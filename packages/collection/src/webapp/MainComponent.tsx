import { HeaderMenuItemRegItem } from '@moodlenet/react-app/ui'
import {
  AuthCtx,
  ReactAppContext,
  ReactAppMainComponent,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import { Route, useNavigate } from 'react-router-dom'
import { CollectionFormValues, MyPkgContext, RpcCaller } from '../common/types.mjs'
import { CollectionPageRoute } from '../ui.mjs'
import { MainContext } from './MainContext.js'

const myRoutes = {
  routes: <Route path="collection/:key" element={<CollectionPageRoute />} />,
}

const menuItems = {
  create: (OnClick: () => void): HeaderMenuItemRegItem => ({
    Icon: '(icon)',
    Text: `New collection`,
    Path: { url: 'http://google.com', ext: true },
    OnClick,
  }),
}

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const nav = useNavigate()
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { registries } = useContext(ReactAppContext)
  const { clientSessionData } = useContext(AuthCtx)

  const me = myPkgCtx.use.me
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
      edit: (collectionId: string, values: CollectionFormValues) =>
        me.rpc['webapp/edit']({ key: collectionId, values }),
      get: (collectionId: string, query?: string | undefined) =>
        me.rpc['webapp/get/:_key'](null, { _key: collectionId }, query), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
      _delete: (collectionId: string) => me.rpc['webapp/delete']({ key: collectionId }),
      setIsPublished: (collectionId: string, publish: boolean) =>
        me.rpc['webapp/setIsPublished']({ key: collectionId, publish }),
      setImage: (key: string, file: File) => me.rpc['webapp/setImage']({ key, file }),
      create: () => me.rpc['webapp/create'](),
      // toggleFollow: (collectionId: string) => me.rpc['webapp/toggleFollow']({ key: collectionId }),
      // toggleBookmark: (collectionId: string) =>
      //   me.rpc['webapp/toggleBookmark']({ key: collectionId }),
    }
  }, [me.rpc])

  const actionsMenu = useMemo(() => {
    const acCreate = () =>
      rpcCaller.create().then(({ data: { collectionId } }) => nav(`/collection/${collectionId}`))

    return {
      create: { action: acCreate, menu: menuItems.create(acCreate) },
    }
  }, [nav, rpcCaller])

  registries.addMenuItems.useRegister(actionsMenu.create.menu, {
    condition: auth.isAuthenticated,
  })
  registries.routes.useRegister(myRoutes)

  const mainValue = {
    ...myPkgCtx,
    rpcCaller: rpcCaller,
    actionsMenu,
    auth,
  }

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
}

export default MainComponent
