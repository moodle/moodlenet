import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import { PROFILE_HOME_PAGE_ROUTE_PATH } from '../../common/webapp-routes.mjs'
import LoginPanelContainer from './page/access/LoginPageContainer.js'
import { RootLoginContainer } from './page/access/RootLoginContainer.js'
import { SignUpContainer } from './page/access/SignupContainer.js'
import { BookmarksPageContainer } from './page/bookmarks/BookmarksPageContainer.js'
import { ProfilePageRoute } from './page/profile/ProfilePageRoute.js'
import { UserSettingsRoute } from './page/settings/UserSettingsRoute.js'

export const pkgRoutes: PkgRoutes = {
  routes: (
    <>
      <Route path="settings" element={<UserSettingsRoute />} />
      <Route path="bookmarks" index element={<BookmarksPageContainer />} />
      <Route path="login">
        <Route index element={<LoginPanelContainer />} />
        <Route path="root" element={<RootLoginContainer />} />
      </Route>
      <Route path="signup">
        <Route index element={<SignUpContainer />} />
      </Route>
      <Route path={PROFILE_HOME_PAGE_ROUTE_PATH} element={<ProfilePageRoute />} />
    </>
  ),
}
