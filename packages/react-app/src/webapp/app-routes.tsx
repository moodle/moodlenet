import { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import { routes } from './registries.mjs'
import LoginPageContent from './ui/components/pages/Access/Login/loginPageContent.js'
import { RootLoginContainer } from './ui/components/pages/Access/RootLogin/RootLoginContainer.js'
import { SignUpContainer } from './ui/components/pages/Access/Signup/SignupContainer.js'
// import * as nodeHomePage from './ui/components/pages/ContentGraph/NodeHome/___NodeHomePage.tsx__'
import { LandingContainer } from './ui/components/pages/Landing/LandingContainer.js'
import { SettingsCtrl } from './ui/components/pages/Settings/SettingsHooks.js'

export type RouteRegItem = { routes: ReactElement; rootPath?: string }

const AppRouter = () => {
  const { registry: routesRegistry } = routes.useRegistry()
  // console.log({ routesRegistry })
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingContainer />} />
        {/* <Route path={nodeHomePage.route} element={<nodeHomePage.Component />} /> */}
        <Route path="settings" element={<SettingsCtrl />} />
        <Route path="login">
          <Route index element={<LoginPageContent />} />
          <Route path="root" element={<RootLoginContainer />} />
        </Route>
        <Route path="signup">
          <Route index element={<SignUpContainer />} />
        </Route>
        {/* <Route
      path="a"
      element={
          <A />
      }
    /> */}
        {routesRegistry.entries.map(({ pkgId, item: { routes, rootPath } }) => {
          return (
            <Route path={rootPath ?? pkgId.name} key={`${pkgId.name}`} caseSensitive>
              {routes}
            </Route>
          )
        })}
      </Routes>
    </>
  )
}

export default AppRouter
