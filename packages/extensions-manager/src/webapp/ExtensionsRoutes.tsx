import { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'
const Index = lazy(() => import('./Extensions'))

const ExtensionsRoutes = (
  <>
    <Route
      index
      element={
        <Suspense fallback="loading...">
          <Index sectionProps={{}} />
        </Suspense>
      }
    />
  </>
)

export default ExtensionsRoutes
