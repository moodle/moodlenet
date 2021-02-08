import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ActivateNewAccountRoute } from './ActivateNewAccount';
import { ContentNodeRoute } from './ContentNode';
import { LoginRoute } from './Login';

export const MNRouter: FC = (/* { children } */) => {
  return (
    <Switch>
      <Route {...LoginRoute} />
      <Route {...ActivateNewAccountRoute} />
      <Route {...ContentNodeRoute} />
    </Switch>
  );
};
