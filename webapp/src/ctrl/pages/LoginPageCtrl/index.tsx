import { t } from '@lingui/macro';
import { FC } from 'react';
import { useFormikWithBag } from '../../../helpers/forms';
import { FormValues, LoginPage, LoginPanelBig } from '../../../ui/pages/Login';
import { useLoginMutation } from './login.gen';

export const LoginPageCtrl: FC = () => {
  const [login, result] = useLoginMutation();
  const [formik, bag] = useFormikWithBag<FormValues>({
    initialValues: { password: '', username: '' },
    onSubmit({ password, username } /* , helpers */) {
      return login({ variables: { password, username } });
    }
  });
  const message = formik.submitCount && !result.data?.createSession ? t`can't login` : '';
  const LoginPanel = <LoginPanelBig form={bag} message={message} />;
  return <LoginPage LoginPanel={LoginPanel} />;
};
