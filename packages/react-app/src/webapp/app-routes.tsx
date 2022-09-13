import { ReactElement, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainContext } from './connect-react-app-lib'
import { Login } from './ui/components/pages/Access/Login/Login'
import { RootLogin } from './ui/components/pages/Access/RootLogin/RootLogin'
import { Signup } from './ui/components/pages/Access/Signup/Signup'
// import * as nodeHomePage from './ui/components/pages/ContentGraph/NodeHome/___NodeHomePage.tsx__'
import { Landing } from './ui/components/pages/Landing/Landing'
import { Settings } from './ui/components/pages/Settings/Settings'

// const A = lazy(() => import('./A'))
export type RouteRegItem = { routes: ReactElement; rootPath?: string }

const AppRouter = () => {
  const {
    registries: { routes },
  } = useContext(MainContext)
  // console.log({ routes })
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
        {routes.entries.map(({ pkg, item: { routes, rootPath } }) => {
          return (
            <Route path={rootPath ?? pkg.name} key={`${pkg.id}`} caseSensitive>
              {routes}
            </Route>
          )
        })}
      </Routes>
    </>
  )
}

export default AppRouter
