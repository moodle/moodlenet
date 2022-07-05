import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import routes from './routes'
import { Login } from './ui/components/pages/Access/Login/Login'
import { RootLogin } from './ui/components/pages/Access/RootLogin/RootLogin'
import { Signup } from './ui/components/pages/Access/Signup/Signup'

// const A = lazy(() => import('./A'))

const AppRouter = () => {
  //console.log('Routes: ', routes)
  return (
    <Router>
      <Routes>
        <Route path="login">
          <Route path="root" element={<RootLogin />} />
          <Route path="email" element={<Login />} />
        </Route>
        <Route path="signup">
          <Route path="email" element={<Signup />} />
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
    </Router>
  )
}

export default AppRouter
