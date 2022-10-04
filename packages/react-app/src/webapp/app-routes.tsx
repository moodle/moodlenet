import { ReactElement, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainContext } from './MainContext.js'
import { routes } from './registries.mjs'
import { Login } from './ui/components/pages/Access/Login/Login.js'
import { RootLogin } from './ui/components/pages/Access/RootLogin/RootLogin.js'
import { Signup } from './ui/components/pages/Access/Signup/Signup.js'
// import * as nodeHomePage from './ui/components/pages/ContentGraph/NodeHome/___NodeHomePage.tsx__'
import { Landing } from './ui/components/pages/Landing/Landing.js'
import { Settings } from './ui/components/pages/Settings/Settings.js'

// const A = lazy(() => import('./A'))
export type RouteRegItem = { routes: ReactElement; rootPath?: string }

const AppRouter = () => {
  const {
    // registries: { routes },
  } = useContext(MainContext)
  const { registry: routesRegistry } = routes.useRegistry()
  // console.log({ routesRegistry })
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path={nodeHomePage.route} element={<nodeHomePage.Component />} /> */}
        <Route path="settings" element={<Settings />} />
        <Route path="login">
          <Route index element={<Login />} />
          <Route path="root" element={<RootLogin />} />
        </Route>
        <Route path="signup">
          <Route index element={<Signup />} />
        </Route>
        {/* <Route
      path="a"
      element={
          <A />
      }
    /> */}
        {routesRegistry.entries.map(({ pkgId, item: { routes, rootPath } }) => {
          return (
            <Route path={rootPath ?? pkgId.name} key={`${pkgId.name}`} caseSensitive>
              {routes}
            </Route>
          )
        })}
      </Routes>
    </>
  )
}

export default AppRouter
