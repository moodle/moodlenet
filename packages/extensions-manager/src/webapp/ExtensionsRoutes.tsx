import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'
const Index = lazy(() => import('./Extensions.js'))

// TODO: hook and container for comp

const ExtensionsRoutes = (
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

export default {
  rootPath: 'extensions',
  routes: ExtensionsRoutes,
}
