import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import {
  CREATE_RESOURCE_PAGE_ROUTE_PATH,
  RESOURCE_HOME_PAGE_ROUTE_PATH,
} from '../common/webapp-routes.mjs'
import {
  CreateResourcePageRoute,
  ResourcePageRoute,
} from './components/pages/Resource/ResourcePageRoute.js'

export const pkgRoutes: PkgRoutes = {
  routes: (
    <>
      <Route path={RESOURCE_HOME_PAGE_ROUTE_PATH} element={<ResourcePageRoute />} />,
      <Route path={CREATE_RESOURCE_PAGE_ROUTE_PATH} element={<CreateResourcePageRoute />} />,
    </>
  ),
}
