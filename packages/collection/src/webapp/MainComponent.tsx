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
  CollectionFormValues,
  MainContextResourceType,
  MyPkgContext,
  RpcCaller,
} from '../common/types.mjs'
import { CollectionPageRoute } from '../ui.mjs'
import { MainContext } from './MainContext.js'

const myRoutes = {
  routes: <Route path="collection/:key" element={<CollectionPageRoute />} />,
}

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
  const auth = useMemo(
    () => ({
      isAuthenticated: !!clientSessionData,
      isAdmin: !!clientSessionData?.isAdmin,
      clientSessionData,
    }),
    [clientSessionData],
  )

  const rpcCaller = useMemo((): RpcCaller => {
    const rpc = me.rpc

    return {
      edit: (key: string, values: CollectionFormValues) => rpc['webapp/edit']({ key: key, values }),
      get: (_key: string) => rpc['webapp/get/:_key']({ _key }), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
      _delete: async (key: string) => await rpc['webapp/delete']({ key: key }),
      setIsPublished: async (key: string, publish: boolean) =>
        await rpc['webapp/setIsPublished']({ key: key, publish }),
      setImage: async (key: string, file: File) => await rpc['webapp/setImage']({ key, file }),
      create: () => rpc['webapp/create'](),
      // toggleFollow: (key: string) => me.rpc['webapp/toggleFollow']({ key: key }), // toggleBookmark: (key: string) => me.rpc['webapp/toggleBookmark']({ key: key }),
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

  const mainValue: MainContextResourceType = {
    ...myPkgCtx,
    rpcCaller: rpcCaller,
    actionsMenu,
    auth,
  }

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
}

export default MainComponent
