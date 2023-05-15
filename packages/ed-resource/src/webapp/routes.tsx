import { Route } from 'react-router-dom'
import { RESOURCE_HOME_PAGE_ROUTE_PATH } from '../common/webapp-routes.mjs'
import { ResourcePageRoute } from './exports/ui.mjs'

export default <Route path={RESOURCE_HOME_PAGE_ROUTE_PATH} element={<ResourcePageRoute />} />
