import { Trans, t } from '@lingui/macro'
import { FC } from 'react'
import { FormBag } from '../../@types/types'

export type SignupFormValues = { email: string }
export type SignupPanelProps = {
  form: FormBag<SignupFormValues>
  message: string | null
}

export const SignupPanelBig: FC<SignupPanelProps> = ({ form, message }) => {
  return (
    <div>
      {message && <span>!! {message} !!</span>}
      <span>
        <Trans>Hey, signup here !</Trans>
      </span>
      <form onSubmit={form.handleSubmit}>
        <input
          {...form.valueName.email}
          placeholder={t`your email`}
          disabled={form.isSubmitting}
          onChange={form.handleChange}
        />
        <button disabled={form.isSubmitting} type="submit">
          <Trans>sign up</Trans>
        </button>
      </form>
    </div>
  )
}
