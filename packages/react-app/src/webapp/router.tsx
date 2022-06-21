import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MainLayout from './ui/components/layout/MainLayout'
// import { Admin } from './ui/components/pages/Admin/Admin'
import routes from './routes'
// const Home = lazy(() => import('./pages/home/Home'))
// const About = lazy(() => import('./pages/about/About'))
// const Contact = lazy(() => import('./pages/contact/Contact'))
const Extensions = lazy(() => import('./ui/components/pages/Extensions/Extensions'))

const AppRouter = () => {
  console.log('Routes: ', routes)
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<div className="lazy-loading">Loading....</div>}>
                <Extensions section="Packages" sectionProps={{}} />
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
                  <Suspense fallback={<div className="lazy-loading">Loading....</div>}>
                    <Component />
                  </Suspense>
                }
              />
            )
          })}
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default AppRouter
