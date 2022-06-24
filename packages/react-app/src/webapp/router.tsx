import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import routes from './routes'
import MainLayout from './ui/components/layout/MainLayout'
import Providers from './ui/components/layout/Providers'
const Extensions = lazy(() => import('./ui/components/pages/Extensions/Extensions'))

const AppRouter = () => {
  console.log('Routes: ', routes)
  return (
    <Router>
      <Providers>
        <MainLayout>
          <Routes>
            <Route
              path="/"
              element={
                // <Suspense fallback={<div className="lazy-loading">Loading....</div>}>
                <Suspense>
                  <Extensions sectionProps={{}} />
                </Suspense>
              }
            />
            {routes.map(({ extId, Component, path }) => {
              return (
                <Route
                  path={path}
                  key={`${extId}#${path}`}
                  caseSensitive
                  element={
                    <Suspense>
                      {/* <Suspense fallback={<div className="lazy-loading">Loading....</div>}> */}
                      <Component />
                    </Suspense>
                  }
                />
              )
            })}
          </Routes>
        </MainLayout>
      </Providers>
    </Router>
  )
}

export default AppRouter
