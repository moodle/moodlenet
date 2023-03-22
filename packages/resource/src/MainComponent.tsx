import { ReactAppContext, ReactAppMainComponent } from '@moodlenet/react-app/web-lib'
import { useContext } from 'react'
import { ReactAppContext, ReactAppMainComponent } from '@moodlenet/react-app/web-lib'
import { useContext } from 'react'
import { Route } from 'react-router-dom'
import { ResourcePageRoute } from '../ui.mjs'
import { MainContext, useMainContext } from './MainContext.js'
import {
  AuthCtx,
  ReactAppContext,
  ReactAppMainComponent,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'

const myRoutes = { rootPath: 'resource', routes: <Route index element={<ResourcePageRoute />} /> }

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const mainValue = useMainContext()
  const mainValue = useMainContext()
  const { registries } = useContext(ReactAppContext)
  registries.routes.useRegister(myRoutes)
  const myPkgCtx = usePkgContext<MyPkgContext>()
  const { clientSessionData } = useContext(AuthCtx)
  const { registries } = useContext(ReactAppContext)
  registries.routes.useRegister(myRoutes)

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
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
      edit: (resourceKey: string, res: ResourceFormValues) =>
        me.rpc['webapp/edit'](resourceKey, res),
      get: (resourceKey: string) => me.rpc['webapp/get']({ param: resourceKey }),
      _delete: (resourceKey: string) => me.rpc['webapp/delete'](resourceKey),
      toggleBookmark: (resourceKey: string) => me.rpc['webapp/toggleBookmark'](resourceKey),
      toggleLike: (resourceKey: string) => me.rpc['webapp/toggleLike'](resourceKey),
      setIsPublished: (resourceKey: string) => me.rpc['webapp/setIsPublished'](resourceKey),
    }
  }, [me.rpc])

  useEffect(() => {
    me.rpc['webapp/get']({ param: '1' }).then(res => {
      console.log(`sample call response:`, res)
    })
  }, [me.rpc])

  return <MainContext.Provider value={mainValue}>{children}</MainContext.Provider>
  return (
    <MainContext.Provider
      value={{
        ...myPkgCtx,
        rpcCaller,
        auth,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}
