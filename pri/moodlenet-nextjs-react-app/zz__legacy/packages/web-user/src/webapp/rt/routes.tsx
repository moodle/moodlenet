import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import {
  BOOKMARKS_PAGE_ROUTE_PATH,
  DELETE_ACCOUNT_SUCCESS_PAGE_PATH,
  LOGIN_PAGE_ROUTE_BASE_PATH,
  LOGIN_ROOT_PAGE_ROUTE_SUB_PATH,
  PROFILE_FOLLOWERS_PAGE_ROUTE_PATH,
  PROFILE_FOLLOWING_PAGE_ROUTE_PATH,
  PROFILE_HOME_PAGE_ROUTE_PATH,
  SETTINGS_PAGE_ROUTE_PATH,
  SIGNUP_PAGE_ROUTE_BASE_PATH,
  USER_AGREEMENTS_PAGE_PATH,
} from '../../common/webapp-routes.mjs'
import { DeleteAccountSuccessContainer } from './page/access/DeleteAccountSuccesContainer'
import LoginPanelContainer from './page/access/LoginPageContainer'
import { RootLoginContainer } from './page/access/RootLoginContainer'
import { SignUpContainer } from './page/access/SignupContainer'
import { UserAgreementContainer } from './page/access/policies/UserAgreementContainer'
import { BookmarksPageContainer } from './page/bookmarks/BookmarksPageContainer'
import { ProfileFollowersPageRoute } from './page/profile-followers/ProfileFollowersPageRoute'
import { ProfileFollowingPageRoute } from './page/profile-following/ProfileFollowingPageRoute'
import { ProfilePageRoute } from './page/profile/ProfilePageRoute'
import { UserSettingsRoute } from './page/settings/UserSettingsRoute'

export const pkgRoutes: PkgRoutes = {
  routes: (
    <>
      <Route path={SETTINGS_PAGE_ROUTE_PATH} element={<UserSettingsRoute />} />
      <Route path={BOOKMARKS_PAGE_ROUTE_PATH} element={<BookmarksPageContainer />} />
      <Route path={LOGIN_PAGE_ROUTE_BASE_PATH}>
        <Route index element={<LoginPanelContainer />} />
        <Route path={LOGIN_ROOT_PAGE_ROUTE_SUB_PATH} element={<RootLoginContainer />} />
      </Route>
      <Route path={SIGNUP_PAGE_ROUTE_BASE_PATH}>
        <Route index element={<SignUpContainer />} />
      </Route>
      <Route path={PROFILE_FOLLOWERS_PAGE_ROUTE_PATH} element={<ProfileFollowersPageRoute />} />
      <Route path={PROFILE_FOLLOWING_PAGE_ROUTE_PATH} element={<ProfileFollowingPageRoute />} />
      <Route path={PROFILE_HOME_PAGE_ROUTE_PATH} element={<ProfilePageRoute />} />
      <Route path={USER_AGREEMENTS_PAGE_PATH} element={<UserAgreementContainer />} />
      <Route path={DELETE_ACCOUNT_SUCCESS_PAGE_PATH} element={<DeleteAccountSuccessContainer />} />
    </>
  ),
}
