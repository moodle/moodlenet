import { Trans, t } from '@lingui/macro';
import { FC } from 'react';
import { FormBag } from '../../../@types/types';

export const LoginPanel: FC<LoginPanelProps> = ({ form, message }) => {
  return (
    <div>
      {message && <span>!! {message} !!</span>}
      <span>
        <Trans>Hey, login here !</Trans>
      </span>
      <form>
        <input
          placeholder={t`your user name`}
          disabled={form.isSubmitting}
          name="username"
          value={form.values.username}
          onChange={form.handleChange}
        />
        <input
          placeholder={t`your password`}
          disabled={form.isSubmitting}
          name="password"
          value={form.values.password}
          onChange={form.handleChange}
        />
        <button disabled={form.isSubmitting} type="submit" onSubmit={form.submitForm}></button>
      </form>
    </div>
  );
};

export type LoginPanelProps = {
  form: FormBag<{ username: string; password: string }>;
  message: string | null;
};
