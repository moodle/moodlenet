import lib from 'moodlenet-react-app-lib'
const Index = lib.react.lazy(() => import('./Extensions'))

const ExtensionsRoutes = (
  <>
    <lib.router.Route
      index
      element={
        <lib.react.Suspense fallback="loading...">
          <Index sectionProps={{}} />
        </lib.react.Suspense>
      }
    />
  </>
)

export default ExtensionsRoutes
