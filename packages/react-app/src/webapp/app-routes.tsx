import { FC, ReactElement, useContext, useEffect } from 'react'
import { redirect, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { MainContext } from './context/MainContext.mjs'
import LoginPageContainer from './ui/components/pages/Access/Login/LoginPageContainer.js'
import { RootLoginContainer } from './ui/components/pages/Access/RootLogin/RootLoginContainer.js'
import { SignUpContainer } from './ui/components/pages/Access/Signup/SignupContainer.js'
// import * as nodeHomePage from './ui/components/pages/ContentGraph/NodeHome/___NodeHomePage.tsx__'
import { LandingContainer } from './ui/components/pages/Landing/LandingContainer.js'
import { MyProfilePageRoute } from './ui/components/pages/Profile/MyProfilePageRoute.js'
import { ProfilePageRoute } from './ui/components/pages/Profile/ProfilePageRoute.js'
import { SettingsPageRoute } from './ui/components/pages/Settings/Settings/Hook/SettingsPageRoute.js'
import { RegistryEntry } from './web-lib/registry.js'

export type RouteRegItem = { routes: ReactElement; rootPath?: string }

const AppRouter = () => {
  const {
    reg: { routes },
  } = useContext(MainContext)
  // console.log({ routesRegistry })
  return (
    <Routes>
      <Route path="/" element={<LandingContainer />} />
      {/* <Route path={nodeHomePage.route} element={<nodeHomePage.Component />} /> */}
      <Route path="settings" element={<SettingsPageRoute />} />
      <Route path="login">
        <Route index element={<LoginPageContainer />} />
        <Route path="root" element={<RootLoginContainer />} />
      </Route>
      <Route path="signup">
        <Route index element={<SignUpContainer />} />
      </Route>
      <Route path="profile/:key/" element={<ProfilePageRoute />} />
      <Route path="my-profile/" element={<MyProfilePageRoute />} />
      {/* <Route
      path="a"
      element={
          <A />
      }
    /> */}
      {routes.registry.entries.map(entry => {
        const {
          pkgId,
          item: { routes, rootPath },
        } = entry
        return rootPath ? (
          <Route key={`custom-pkg-route:${pkgId.name}`}>
            <Route path={rootPath} key={`custom-base-route:${pkgId.name}`} caseSensitive>
              {routes}
            </Route>
            <Route
              path={`/${pkgId.name}/*`}
              key={`canonical-redirect:${pkgId.name}`}
              caseSensitive
              element={<RedirectToCustomRoute entry={entry} />}
            />
          </Route>
        ) : (
          <Route path={`/${pkgId.name}/`} key={`canonical:${pkgId.name}`} caseSensitive>
            {routes}
          </Route>
        )
      })}
    </Routes>
  )
}

export default AppRouter

const RedirectToCustomRoute: FC<{ entry: RegistryEntry<RouteRegItem> }> = ({ entry }) => {
  const loc = useLocation()
  const redirectString = loc.pathname.replace(
    new RegExp(`^/${entry.pkgId.name}/`),
    `${entry.item.rootPath}`,
  )
  const nav = useNavigate()
  redirect(redirectString)
  useEffect(() => {
    nav(redirectString, { replace: true })
  }, [nav, redirectString])
  return null
}
