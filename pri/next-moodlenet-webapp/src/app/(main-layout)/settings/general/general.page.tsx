import { priAccess } from '../../../../lib/server/session-access'
import { GeneralSettingsClient } from './general.client'
import { t } from 'i18next'

export default async function GeneralPage() {
  const { iamSchemaConfigs } = await priAccess().moodle.netWebappNextjs.v1_0.pri.schemaConfigs.iam()

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
