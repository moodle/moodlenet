import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import { SUBJECT_HOME_PAGE_ROUTE_PATH } from '../../common/webapp-routes.mjs'
import { SubjectPageRoute } from '../components/pages/Subject/SubjectPageRoute.js'

export const pkgRoutes: PkgRoutes = {
  routes: <Route path={SUBJECT_HOME_PAGE_ROUTE_PATH} element={<SubjectPageRoute />} />,
}
