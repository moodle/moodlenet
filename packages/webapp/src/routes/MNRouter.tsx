import { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { LandingRoute } from './LandingRoute'
import { SearchRoute } from './SearchRoute'

export const MNRouter: FC = (/* { children } */) => {
  return (
    <Switch>
      <Route {...SearchRoute} />
      <Route {...LandingRoute} />
    </Switch>
  )
}
