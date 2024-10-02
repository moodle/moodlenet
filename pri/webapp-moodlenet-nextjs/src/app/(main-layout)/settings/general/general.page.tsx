import { t } from 'i18next'
import { priAccess } from '../../../../lib/server/session-access'
import { GeneralSettingsClient } from './general.client'

export default async function GeneralPage() {
  const { iamSchemaConfigs } = await priAccess().netWebappNextjs.schemaConfigs.iam()

  const noEqualPasswordsError = t('Passwords must be different')

  return (
    <GeneralSettingsClient
      {...{
        messages: { noEqualPasswordsError },
        iamSchemaConfigs,
      }}
    />
  )
}
