import { Trans, t } from '@lingui/macro';
import { FC } from 'react';
import { FormBag } from '../../@types/types';

export type FormValues = { username: string; password: string };
export type LoginPanelProps = {
  form: FormBag<FormValues>;
  message: string | null;
};

export const LoginPanelBig: FC<LoginPanelProps> = ({ form, message }) => {
  return (
    <div>
      {message && <span>!! {message} !!</span>}
      <span>
        <Trans>Hey, login here !</Trans>
      </span>
      <form onSubmit={form.handleSubmit}>
        <input
          {...form.valueName.username}
          placeholder={t`your user name`}
          disabled={form.isSubmitting}
          onChange={form.handleChange}
        />
        <input
          {...form.valueName.password}
          type="password"
          placeholder={t`your password`}
          disabled={form.isSubmitting}
          onChange={form.handleChange}
        />
        <button disabled={form.isSubmitting} type="submit">
          <Trans>enter</Trans>
        </button>
      </form>
    </div>
  );
};
