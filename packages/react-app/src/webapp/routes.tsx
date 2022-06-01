import { createContext, FC, lazy, PropsWithChildren, Suspense, useContext, useMemo, useReducer } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AppRoute } from './types'
import MainLayout from './ui/components/layout/MainLayout'
// import { Admin } from './ui/components/pages/Admin/Admin'

// const Home = lazy(() => import('./pages/home/Home'))
// const About = lazy(() => import('./pages/about/About'))
// const Contact = lazy(() => import('./pages/contact/Contact'))
const Extensions = lazy(() => import('./ui/components/pages/Extensions/Extensions'))

export type RouterCtxT = {
  addRoute(route: AppRoute): void
  routes: AppRoute[]
}
export type RouterCtx = typeof RouterCtx
export const RouterCtx = createContext<RouterCtxT>({
  addRoute() {},
  routes: [],
})

export const ProvideAppRouterContext: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [routes, addRoute] = useReducer(
    (prev: AppRoute[], route: AppRoute) => [...prev, route],
    [{ label: 'Extensions', path: '/', Component: Extensions }],
  )
  const ctx = useMemo<RouterCtxT>(
    () => ({
      addRoute,
      routes,
    }),
    [routes],
  )
  return <RouterCtx.Provider value={ctx}>{children}</RouterCtx.Provider>
}

const AppRouter = () => {
  const { routes } = useContext(RouterCtx)
  console.log('Routes: ', routes)
  return (
    <Router>
      <MainLayout>
        <Routes>
          {routes
            .map(r => {
              console.log('route ', r)
              return r
            })
            .map(({ Component, path }, k) => (
              <Route
                path={path}
                key={k}
                element={
                  <Suspense fallback={<div className="lazy-loading">Loading....</div>}>
                    <Component />
                  </Suspense>
                }
              />
            ))}
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default AppRouter
