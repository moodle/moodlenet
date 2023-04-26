import { Link } from '@moodlenet/react-app/ui'
import { ReactAppContext, usePkgContext } from '@moodlenet/react-app/webapp'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Route } from 'react-router-dom'
import { MyContext } from './Context.js'
import HelloWorldPage from './HelloWorldPage.jsx'

const myRoutes = { routes: <Route index element={<HelloWorldPage />} /> }

const MyPageLink = () => {
  return <Link href={{ url: '/my-moodlenet-mjs-pkg-template' }}>my page</Link>
}
const myRightComponent = { Component: MyPageLink }
const myPageMenuItem = {
  Text: 'My page',
  Icon: null,
  Path: { url: '/my-moodlenet-mjs-pkg-template' },
}
const MainComponent = ({ children }) => {
  const pkgCtx = usePkgContext()
  const { registries } = useContext(ReactAppContext)
  registries.routes.useRegister(myRoutes)
  registries.headerRightComponents.useRegister(myRightComponent)
  registries.avatarMenuItems.useRegister(myPageMenuItem)

  const [apiResponse, setApiResponse] = useState()
  useEffect(() => {
    pkgCtx.use.me.rpc['hello/world']({
      stringParam: 'my string param',
      numberParam: 100,
    }).then(setApiResponse)
  }, [pkgCtx.use.me])

  const ctx = useMemo(() => ({ apiResponse }), [apiResponse])
  return <MyContext.Provider value={ctx}>{children}</MyContext.Provider>
}
MainComponent.displayName = 'MyMainComponent'

export default MainComponent
