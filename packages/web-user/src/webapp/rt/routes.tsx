import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import {
  MY_PROFILE_HOME_PAGE_ROUTE_PATH,
  PROFILE_HOME_PAGE_ROUTE_PATH,
} from '../../common/webapp-routes.mjs'
import LoginPanelContainer from './page/access/LoginPageContainer.js'
import { RootLoginContainer } from './page/access/RootLoginContainer.js'
import { SignUpContainer } from './page/access/SignupContainer.js'
import { BookmarksPageContainer } from './page/Bookmarks/BookmarksPageContainer.js'
import { MyProfilePageRoute } from './page/Profile/MyProfilePageRoute.js'
import { ProfilePageRoute } from './page/Profile/ProfilePageRoute.js'

export const pkgRoutes: PkgRoutes = {
  routes: (
    <>
      <Route path="bookmarks" index element={<BookmarksPageContainer />} />
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
