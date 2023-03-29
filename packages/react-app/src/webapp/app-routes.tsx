import { ReactElement, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainContext } from './context/MainContext.mjs'
import LoginPageContainer from './ui/components/pages/Access/Login/LoginPageContainer.js'
import { RootLoginContainer } from './ui/components/pages/Access/RootLogin/RootLoginContainer.js'
import { SignUpContainer } from './ui/components/pages/Access/Signup/SignupContainer.js'
import { LandingContainer } from './ui/components/pages/Landing/LandingContainer.js'
import { MyProfilePageRoute } from './ui/components/pages/Profile/MyProfilePageRoute.js'
import { ProfilePageRoute } from './ui/components/pages/Profile/ProfilePageRoute.js'
import { SettingsPageRoute } from './ui/components/pages/Settings/Settings/Hook/SettingsPageRoute.js'

export type RouteRegItem = { routes: ReactElement }

const AppRouter = () => {
  const {
    reg: { routes },
  } = useContext(MainContext)
  return (
    <Routes>
      <Route path="/" index element={<LandingContainer />} />
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
      {routes.registry.entries.flatMap(entry => {
        const {
          pkgId,
          item: { routes },
        } = entry
        return (
          <Route path={`/`} key={`pkg-routes:${pkgId.name}`}>
            {routes}
          </Route>
        )
      })}
    </Routes>
  )
}

export default AppRouter
