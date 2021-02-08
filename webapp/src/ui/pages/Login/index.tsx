import { FC, ReactElement } from 'react';
import { EmptyPageTemplate } from '../../templates/page/EmptyPageTemplate';
export * from '../../components/LoginPanelBig';
export * from '../../components/SignupPanelBig';

export type LoginPageProps = {
  LoginPanel: ReactElement;
  SignupPanel: ReactElement;
};

export const LoginPage: FC<LoginPageProps> = ({ LoginPanel, SignupPanel }) => {
  return (
    <EmptyPageTemplate>
      <div>{LoginPanel}</div>
      <div>{SignupPanel}</div>
    </EmptyPageTemplate>
  );
};
