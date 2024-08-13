import type { PkgRoutes } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import { OpenIdInteractionPageRoute } from './page/OpenIdInteractionPageRoute.js'

export const pkgRoutes: PkgRoutes = {
  routes: (
    <>
      <Route path="openid/interaction/:interactionId" element={<OpenIdInteractionPageRoute />} />
    </>
  ),
}
