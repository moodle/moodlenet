import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'
const Index = lazy(() => import('./I'))

const AuthRoutes = (
  <>
    <Route
      index
      element={
        <Suspense fallback="loading...">
          <Index />
        </Suspense>
      }
    />
  </>
)

export default AuthRoutes
