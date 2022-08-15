import routes from 'ext-routes'
import { Route, Routes } from 'react-router-dom'
import { Login } from './ui/components/pages/Access/Login/Login'
import { RootLogin } from './ui/components/pages/Access/RootLogin/RootLogin'
import { Signup } from './ui/components/pages/Access/Signup/Signup'
import { Landing } from './ui/components/pages/Landing/Landing'
import { Settings } from './ui/components/pages/Settings/Settings'

// const A = lazy(() => import('./A'))

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
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
        {routes.map(({ extId, extRoutingElement, extName, rootPath }) => {
          return (
            <Route path={rootPath ?? extName} key={`${extId}`} caseSensitive>
              {extRoutingElement}
            </Route>
          )
        })}
      </Routes>
    </>
  )
}

export default AppRouter
