'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { getPrimarySchemas } from '@moodle/mod-iam/v1_0/lib'
import type * as iam_v1_0 from '@moodle/mod-iam/v1_0/types'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { Trans, useTranslation } from 'next-i18next'
import { ReactElement, useEffect, useState } from 'react'
import { Card } from '../../../../ui/atoms/Card/Card'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { Snackbar } from '../../../../ui/atoms/Snackbar/Snackbar'
import SnackbarStack from '../../../../ui/atoms/Snackbar/SnackbarStack'
import { changePasswordAction } from './general.server'
import './general.style.scss'

export interface GeneralSettingsProps {
  iamSchemaConfigs: iam_v1_0.PrimaryMsgSchemaConfigs
  messages: { noEqualPasswordsError: string }
}
export function GeneralSettingsClient({ iamSchemaConfigs, messages }: GeneralSettingsProps) {
  const { t } = useTranslation()
  const { changePasswordSchema } = getPrimarySchemas(iamSchemaConfigs)
  const [snackbarList, setSnackbarList] = useState<ReactElement[]>([])

  const {
    form: { formState, register },
    resetFormAndAction,
    handleSubmitWithAction,
  } = useHookFormAction(
    changePasswordAction,
    zodResolver(
      changePasswordSchema.superRefine(({ currentPassword, newPassword }, ctx) => {
        if (currentPassword.__redacted__ === newPassword.__redacted__) {
          ctx.addIssue({
            code: 'custom',
            message: messages.noEqualPasswordsError,
            path: ['newPassword.__redacted__'],
          })
        }
      }),
    ),
    {
      actionProps: {
        onExecute() {
          setSnackbarList([])
          resetFormAndAction()
        },
      },
    },
  )
  useEffect(() => {
    setSnackbarList(
      formState.isSubmitting
        ? []
        : formState.errors.root?.message
          ? [
              <Snackbar key={`password-change-error`} type="error">
                {formState.errors.root?.message}
              </Snackbar>,
            ]
          : [
              <Snackbar key={`password-change-success`} type="success">
                <Trans>Password changed</Trans>
              </Snackbar>,
            ],
    )
  }, [formState.errors.root?.message, formState.isSubmitting])

  const snackbars = <SnackbarStack snackbarList={snackbarList}></SnackbarStack>

  return (
    <div className="general" key="general">
      {formState.isSubmitSuccessful && snackbars}
      <Card className="column">
        <div className="title">
          <Trans>General</Trans>
        </div>
      </Card>
      <Card className="column change-password-section">
        <form onSubmit={handleSubmitWithAction} className="parameter">
          <div className="name">
            <Trans>Change password</Trans>
          </div>
          <div className="actions">
            <InputTextField
              className="password"
              placeholder={t('Enter your current password')}
              type="password"
              autoComplete="new-password"
              error={formState.errors.currentPassword?.__redacted__?.message}
              {...register('currentPassword.__redacted__')}
            />
          </div>
          <br />
          <div className="actions">
            <InputTextField
              className="password"
              placeholder={t('Enter your new password')}
              type="password"
              autoComplete="new-password"
              error={formState.errors.newPassword?.__redacted__?.message}
              {...register('newPassword.__redacted__')}
            />
          </div>
          <br />
          <PrimaryButton type="submit" disabled={formState.isSubmitting} className="save-btn">
            <Trans>Save</Trans>
          </PrimaryButton>
        </form>
      </Card>
    </div>
  )
}
