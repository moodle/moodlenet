import { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ActivationRoute } from './ActivateNewUserRoute'
import { LandingRoute } from './LandingRoute'
import { LoginRoute } from './LoginRoute'
import { ProfileRoute } from './ProfileRoute'
import { SearchRoute } from './SearchRoute'
import { SignupRoute } from './SignUpRoute'

export const MNRouter: FC = (/* { children } */) => {
  return (
    <Switch>
      <Route {...SearchRoute} />
      <Route {...ProfileRoute} />
      <Route {...LoginRoute} />
      <Route {...SignupRoute} />
      <Route {...ActivationRoute} />
      <Route {...LandingRoute} />
    </Switch>
  )
}
