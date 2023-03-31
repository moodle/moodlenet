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
    return {
      edit: (collectionId: string, values: CollectionFormValues) =>
        me.rpc['webapp/edit']({ key: collectionId, values }),
      get: (collectionId: string) => me.rpc['webapp/get/:_key'](null, { _key: collectionId }), // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
      _delete: async (collectionId: string) => {
        await me.rpc['webapp/delete/:_key'](null, { _key: collectionId })
      },
      setIsPublished: async (collectionId: string, publish: boolean) => {
        await me.rpc['webapp/setIsPublished']({ key: collectionId, publish })
      },
      setImage: async (_key: string, file: File) => {
        await me.rpc['webapp/collection/:_key/uploadImage']({ file }, { _key })
      },
      create: () => me.rpc['webapp/create'](),
    }
  }, [me.rpc])

  const actionsMenu = useMemo(() => {
    const acCreate = () => rpcCaller.create().then(({ _key }) => nav(`/collection/${_key}`))

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
