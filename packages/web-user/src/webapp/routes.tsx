import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import {
  MY_PROFILE_HOME_PAGE_ROUTE_PATH,
  PROFILE_HOME_PAGE_ROUTE_PATH,
} from '../common/webapp-routes.mjs'
import LoginPanelContainer from './ui/components/pages/Access/Login/LoginPageContainer.js'
import { RootLoginContainer } from './ui/components/pages/Access/RootLogin/RootLoginContainer.js'
import { SignUpContainer } from './ui/components/pages/Access/Signup/SignupContainer.js'
import { MyProfilePageRoute } from './ui/components/pages/Profile/MyProfilePageRoute.js'
import { ProfilePageRoute } from './ui/components/pages/Profile/ProfilePageRoute.js'

export const pkgRoutes: PkgRoutes = {
  routes: (
    <>
      <Route path="login">
        <Route index element={<LoginPanelContainer />} />
        <Route path="root" element={<RootLoginContainer />} />
      </Route>
      <Route path="signup">
        <Route index element={<SignUpContainer />} />
      </Route>
      <Route path={PROFILE_HOME_PAGE_ROUTE_PATH} element={<ProfilePageRoute />} />
      <Route path={MY_PROFILE_HOME_PAGE_ROUTE_PATH} element={<MyProfilePageRoute />} />
    </>
  ),
}
