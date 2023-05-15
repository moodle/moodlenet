import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import { COLLECTION_HOME_PAGE_ROUTE_PATH } from '../common/webapp-routes.mjs'
import { CollectionPageRoute } from './exports/ui.mjs'

export const pkgRoutes: PkgRoutes = {
  routes: <Route path={COLLECTION_HOME_PAGE_ROUTE_PATH} element={<CollectionPageRoute />} />,
}
