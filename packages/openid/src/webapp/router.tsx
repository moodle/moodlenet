import { RouteRegItem } from '@moodlenet/react-app/web-lib'
import { Route } from 'react-router-dom'
import { OpenIdInteractionPageRoute } from './page/OpenIdInteractionPageRoute.js'

export const routesItem: RouteRegItem = {
  routes: (
    <>
      <Route path="interaction/:interactionId" element={<OpenIdInteractionPageRoute />} />
    </>
  ),
}
