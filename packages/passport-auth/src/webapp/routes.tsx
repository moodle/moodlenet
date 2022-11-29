import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'
const LoginSuccess = lazy(() => import('./LoginSuccess'))
const LoginFail = lazy(() => import('./LoginFail'))

const AuthRoutes = (
  <>
    <Route
      path="login-success"
      element={
        <Suspense fallback="loading...">
          <LoginSuccess />
        </Suspense>
      }
    />
    <Route
      path="login-fail"
      element={
        <Suspense fallback="loading...">
          <LoginFail />
        </Suspense>
      }
    />
  </>
)

export default AuthRoutes
