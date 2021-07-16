import { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { LandingRoute } from './LandingRoute'
import { LoginRoute } from './LoginRoute'
import { ProfileRoute } from './ProfileRoute'
import { SearchRoute } from './SearchRoute'

export const MNRouter: FC = (/* { children } */) => {
  return (
    <Switch>
      <Route {...SearchRoute} />
      <Route {...ProfileRoute} />
      <Route {...LoginRoute} />
      <Route {...LandingRoute} />
    </Switch>
  )
}
