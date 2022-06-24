import lib from 'moodlenet-react-app-lib'
const A = lib.react.lazy(() => import('./A'))
const Index = lib.react.lazy(() => import('./I'))

const AuthRoutes = (
  <>
    <lib.router.Route
      index
      element={
        <lib.react.Suspense fallback="loading...">
          <Index />
        </lib.react.Suspense>
      }
    />
    <lib.router.Route
      path="a"
      element={
        <lib.react.Suspense fallback="loading...">
          <A />
        </lib.react.Suspense>
      }
    />
  </>
)

export default AuthRoutes
