import { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { LandingRoute } from './Landing'

export const MNRouter: FC = (/* { children } */) => {
  return (
    <Switch>
      <Route {...LandingRoute} />
    </Switch>
  )
}
