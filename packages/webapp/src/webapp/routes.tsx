import { createContext, FC, Suspense, useContext, useMemo, useReducer } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import { AppRoute } from './types'

// const Home = lazy(() => import('./pages/home/Home'))
// const About = lazy(() => import('./pages/about/About'))
// const Contact = lazy(() => import('./pages/contact/Contact'))

export type RouterCtxT = {
  addRoute(route: AppRoute): void
  routes: AppRoute[]
}
export type RouterCtx = typeof RouterCtx
export const RouterCtx = createContext<RouterCtxT>({ addRoute() {}, routes: [] })

export const AppRouterContextProvider: FC = ({ children }) => {
  const [routes, addRoute] = useReducer((prev:AppRoute[], route:AppRoute)=>[...prev,route], [])
  const ctx = useMemo<RouterCtxT>(() => ({
    addRoute,
    routes,
  }), [routes])
  return <RouterCtx.Provider value={ctx}>{children}</RouterCtx.Provider>
}
const AppRouter = () => {
  const { routes } = useContext(RouterCtx)
  return (
    <Router>
      <MainLayout>
        <Routes>
          {routes.map(({ Component, path }, k) => (
            <Route
              path={path}
              key={k}
              element={
                <Suspense fallback={<div className="lazy-loading">Loading...</div>}>
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
