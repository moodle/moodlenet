import { Trans, t } from '@lingui/macro'
import { FC } from 'react'
import { FormBag } from '../../@types/types'

export type ActivateAccountFormValues = {
  username: string
  password: string
  acceptTerms: boolean
  confirmPassword: string
}
export type ActivateAccountPanelProps = {
  form: FormBag<ActivateAccountFormValues>
  message: string | undefined
}

export const ActivateAccountPanel: FC<ActivateAccountPanelProps> = ({ form, message }) => {
  return (
    <div>
      <span>
        <Trans>Activate your new account</Trans>
      </span>
      <br />
      <span>{message}</span>
      <form onSubmit={form.handleSubmit}>
        <br />
        <span>username err:{form.errors.username}</span>
        <input
          {...form.valueName.username}
          placeholder={t`username`}
          disabled={form.isSubmitting}
          onChange={form.handleChange}
        />
        <br />
        <span>password err:{form.errors.password}</span>
        <input
          {...form.valueName.password}
          type="password"
          placeholder={t`your password`}
          disabled={form.isSubmitting}
          onChange={form.handleChange}
        />
        <br />
        <span>confirmPassword err:{form.errors.confirmPassword}</span>
        <input
          {...form.valueName.confirmPassword}
          type="password"
          placeholder={t`confirm your password`}
          disabled={form.isSubmitting}
          onChange={form.handleChange}
        />
        <br />
        <span>acceptTerms err:{form.errors.acceptTerms}</span>
        <input
          name={form.valueName.acceptTerms.name}
          placeholder={t`accept terms`}
          checked={form.valueName.acceptTerms.value}
          type="checkbox"
          onChange={form.handleChange}
        />
        <button disabled={form.isSubmitting} type="submit">
          <Trans>activate</Trans>
        </button>
      </form>
    </div>
  )
}
