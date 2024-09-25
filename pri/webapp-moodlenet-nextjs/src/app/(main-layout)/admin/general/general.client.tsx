'use client'
import { Trans, useTranslation } from 'react-i18next'
import { Card } from '../../../../ui/atoms/Card/Card'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'

export interface GeneralProps {}

export function GeneralClient({}: GeneralProps) {
  const { t } = useTranslation()
  const {form:{formState},handleSubmitWithAction}=useHookFormAction(generalSchema,saveGeneralAction)
  return (
    <div className="general" key="general">
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
              error={shouldShowErrors && form.errors.instanceName}
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
              error={shouldShowErrors && editForm.errors.displayName}
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
              error={shouldShowErrors && editForm.errors.displayName}
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
              error={shouldShowErrors && editForm.errors.displayName}
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
              name="locationUrl"
              error={shouldShowErrors && editForm.errors.displayName}
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
              error={shouldShowErrors && editForm.errors.displayName}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
