import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import routes from './routes'
import MainLayout from './ui/components/layout/MainLayout'
const Extensions = lazy(() => import('./ui/components/pages/Extensions/Extensions'))

const AppRouter = () => {
  //console.log('Routes: ', routes)
  return (
    <Router>
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
            {routes.map(({ extId, extRoutingElement, extName, rootPath }) => {
              return (
                <Route path={rootPath ?? extName} key={`${extId}`} caseSensitive>
                  {extRoutingElement}
                </Route>
              )
            })}
          </Routes>
        </MainLayout>
    </Router>
  )
}

export default AppRouter
