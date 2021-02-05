import { FC } from 'react';
import { EmptyPageTemplate } from '../../templates/page/EmptyPageTemplate';
import { LoginPanel } from './LoginPanel';

export const defaultComponents = {
  LoginPanel
};

export const LoginPage: FC<LoginPageProps> = ({ LoginPanel }) => {
  return (
    <EmptyPageTemplate>
      <div>
        <LoginPanel />
      </div>
    </EmptyPageTemplate>
  );
};

export type LoginPageProps = {
  LoginPanel: FC;
};
