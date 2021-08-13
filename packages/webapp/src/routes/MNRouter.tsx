import { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ActivationRoute } from './ActivateNewUserRoute'
import { CollectionRoute } from './CollectionRoute'
import { LandingRoute } from './LandingRoute'
import { LoginRoute } from './LoginRoute'
import { NewCollectionRoute } from './NewCollectionRoute'
import { NewResourceRoute } from './NewResourceRoute'
import { ProfileRoute } from './ProfileRoute'
import { ResourceRoute } from './ResourceRoute'
import { SearchRoute } from './SearchRoute'
import { SignupRoute } from './SignUpRoute'

export const MNRouter: FC = (/* { children } */) => {
  return (
    <Switch>
      <Route {...SearchRoute} />
      <Route {...NewResourceRoute} />
      <Route {...NewCollectionRoute} />
      <Route {...ProfileRoute} />
      <Route {...ResourceRoute} />
      <Route {...CollectionRoute} />
      <Route {...LoginRoute} />
      <Route {...SignupRoute} />
      <Route {...ActivationRoute} />
      <Route {...LandingRoute} />
    </Switch>
  )
}
