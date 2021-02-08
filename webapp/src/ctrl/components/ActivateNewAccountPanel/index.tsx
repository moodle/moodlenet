import { t } from '@lingui/macro';
import { FC, useState } from 'react';
import { boolean, object, ref, SchemaOf, string } from 'yup';
import { useFormikWithBag } from '../../../helpers/forms';
import {
  ActivateAccountFormValues,
  ActivateAccountPanel
} from '../../../ui/pages/ActivateNewAccount';
import { useActivateNewAccountMutation } from './activateNewAccount.gen';

export type ActivateNewAccountPanelProps = { token: string };

export const ActivateNewAccountPanelCtrl: FC<ActivateNewAccountPanelProps> = ({ token }) => {
  const [activateNewAccount, result] = useActivateNewAccountMutation();
  const [message, setMessage] = useState<string>();
  const [, bag] = useFormikWithBag<ActivateAccountFormValues>({
    initialValues: { username: '', confirmPassword: '', password: '', acceptTerms: false },
    validationSchema,
    onSubmit({ username, password }) {
      return activateNewAccount({ variables: { token, username, password } }).then(({ errors }) => {
        setMessage(errors?.map(_ => _.message).join('\n'));
      });
    }
  });
  return (
    <ActivateAccountPanel form={bag} message={result.data?.activateAccount.message || message} />
  );
};
const validationSchema: SchemaOf<ActivateAccountFormValues> = object({
  username: string()
    .min(3)
    .max(16)
    //    .matches(USERNAME_REGEX)
    .required(),
  password: string().min(6).max(50).required(),
  confirmPassword: string()
    .oneOf([ref('password'), null], t`Passwords must match`)
    .required(),
  acceptTerms: boolean()
    .oneOf([true], t`Must Accept Terms and Conditions`)
    .required()
});
