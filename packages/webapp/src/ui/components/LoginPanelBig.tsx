import { Trans, t } from '@lingui/macro'
import { FC } from 'react'
import { FormBag } from '../../@types/types'

export type LoginFormValues = { username: string; password: string }
export type LoginPanelProps = {
  form: FormBag<LoginFormValues>
  message: string | null
}

export const LoginPanelBig: FC<LoginPanelProps> = ({ form, message }) => {
  return (
    <div>
      {message && <span>!! {message} !!</span>}
      <span>
        <Trans>Hey, login here !</Trans>
      </span>
      <form onSubmit={form.handleSubmit}>
        {form.errors.username && <span>!! {form.errors.username} !!</span>}
        <input
          {...form.valueName.username}
          placeholder={t`your user name`}
          disabled={form.isSubmitting}
          onChange={form.handleChange}
        />
        <br />
        {form.errors.password && <span>!! {form.errors.password} !!</span>}
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
  )
}
