'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { siteInfoForm } from '@moodle/module/moodlenet'
import { orgInfoForm } from '@moodle/module/org'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { Trans, useTranslation } from 'react-i18next'
import { useAllPrimarySchemas } from '../../../../lib/client/globalContexts'
import { Card } from '../../../../ui/atoms/Card/Card'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { provideAdminGeneralSchemas } from './general.common'
import { saveGeneralInfoAction } from './general.server'

export type GeneralFormValues = Pick<
  orgInfoForm & siteInfoForm,
  'name' | 'copyright' | 'title' | 'physicalAddress' | 'subtitle' | 'websiteUrl'
>

export interface GeneralProps {
  generalFormValues: GeneralFormValues
}

export function GeneralClient({ generalFormValues }: GeneralProps) {
  const { t } = useTranslation()
  const { generalSchema } = provideAdminGeneralSchemas(useAllPrimarySchemas())
  const {
    form: { formState, register, reset },
    handleSubmitWithAction,
  } = useHookFormAction(saveGeneralInfoAction, zodResolver(generalSchema), {
    formProps: {
      defaultValues: generalFormValues,
      resetOptions: { keepDirtyValues: true, keepValues: true },
    },
    actionProps: {
      onExecute({ input }) {
        reset(input)
      },
    },
  })

  return (
    <form className="general" onSubmit={handleSubmitWithAction} key="general">
      <Card className="column">
        <div className="title">
          <Trans>General</Trans>
          <PrimaryButton type="submit" disabled={!formState.isDirty} className="save-btn">
            Save
          </PrimaryButton>
        </div>
      </Card>
      <Card className="column">
        <div className="parameter">
          <div className="name">
            <Trans>Site name</Trans>
          </div>
          <div className="actions">
            <InputTextField
              className="instance-name"
              placeholder={t('Give a name to your site')}
              {...register('name')}
              error={formState.errors.name?.message}
            />
          </div>
        </div>
        <div className="parameter">
          <div className="name">
            <Trans>Landing page title</Trans>
          </div>
          <div className="actions">
            <InputTextField
              isTextarea
              edit
              className="landing-title"
              placeholder={t('Give a title to the landing page')}
              {...register('title')}
              error={formState.errors.title?.message}
            />
          </div>
        </div>
        <div className="parameter">
          <div className="name">
            <Trans>Landing page subtitle</Trans>
          </div>
          <div className="actions">
            <InputTextField
              isTextarea
              edit
              className="landing-subtitle"
              placeholder={t('Give a subtitle to the landing page')}
              {...register('subtitle')}
              error={formState.errors.subtitle?.message}
            />
          </div>
        </div>

        <div className="parameter">
          <div className="name">
            <Trans>Organization location address</Trans>
          </div>
          <div className="actions">
            <InputTextField
              isTextarea
              edit
              className="location-address"
              placeholder={t('Give a location address')}
              {...register('physicalAddress')}
              error={formState.errors.physicalAddress?.message}
            />
          </div>
        </div>

        <div className="parameter">
          <div className="name">
            <Trans>Location url</Trans>
          </div>
          <div className="actions">
            <InputTextField
              isTextarea
              edit
              className="location-url"
              placeholder={t('Give a location url')}
              {...register('websiteUrl')}
              error={formState.errors.websiteUrl?.message}
            />
          </div>
        </div>

        <div className="parameter">
          <div className="name">
            <Trans>Copyright</Trans>
          </div>
          <div className="actions">
            <InputTextField
              isTextarea
              edit
              className="copyright"
              placeholder={t('Organization copyright statement')}
              {...register('copyright')}
              error={formState.errors.copyright?.message}
            />
          </div>
        </div>
      </Card>
    </form>
  )
}
