import { Suspense } from 'react'
import { Route } from 'react-router-dom'
import LoginFail from './LoginFail'
import LoginSuccess from './LoginSuccess'

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
