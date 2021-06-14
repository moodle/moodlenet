import { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ActivateNewUserRoute } from './ActivateNewUser'
import { ContentNodeRoute } from './ContentNode'
import { GlobalSearchRoute } from './GlobalSearch'
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
      <Route {...ActivateNewUserRoute} />
      <Route {...ContentNodeRoute} />
      <Route {...HomeRoute} />
      <Route {...GlobalSearchRoute} />
    </Switch>
  )
}
