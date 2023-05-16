import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import { RESOURCE_HOME_PAGE_ROUTE_PATH } from '../common/webapp-routes.mjs'
import { ResourcePageRoute } from './components/pages/Resource/ResourcePageRoute.js'

export const pkgRoutes: PkgRoutes = {
  routes: <Route path={RESOURCE_HOME_PAGE_ROUTE_PATH} element={<ResourcePageRoute />} />,
}
