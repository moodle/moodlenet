import { RouteRegItem } from '@moodlenet/react-app/webapp'
import { Route } from 'react-router-dom'
import { OpenIdInteractionPageRoute } from './page/OpenIdInteractionPageRoute.js'

export const routesItem: RouteRegItem = {
  routes: (
    <>
      <Route path="openid/interaction/:interactionId" element={<OpenIdInteractionPageRoute />} />
    </>
  ),
}
