import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import { LmsLandingRouteComponent } from './lms-landing-page/LmsLandingRoute'

export const pkgRoutes: PkgRoutes = {
  routes: (
    <>
      <Route path="/lms/moodle/search" element={<LmsLandingRouteComponent />} />
    </>
  ),
}
