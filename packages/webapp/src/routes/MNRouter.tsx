import { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ActivateNewAccountRoute } from './ActivateNewAccount'
import { ContentNodeRoute } from './ContentNode'
import { HomeRoute } from './Home'
import { LoginRoute } from './Login'
import { SignupRoute } from './Signup'
import { TermsAndConditionsRoute } from './TermsAndConditions'

export const MNRouter: FC = (/* { children } */) => {
  return (
    <Switch>
      <Route {...LoginRoute} />
      <Route {...SignupRoute} />
      <Route {...TermsAndConditionsRoute} />
      <Route {...ActivateNewAccountRoute} />
      <Route {...ContentNodeRoute} />
      <Route {...HomeRoute} />
    </Switch>
  )
}
