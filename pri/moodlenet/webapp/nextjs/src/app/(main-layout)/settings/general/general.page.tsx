import { priAccess } from '../../../../lib/server/session-access'
import { GeneralSettingsClient } from './general.client'
import { t } from 'i18next'

export default async function GeneralPage() {
  const { iam } = await priAccess().moodle.iam.v1_0.pri.configs.read()

  const noEqualPasswordsError = t('Passwords must be different')

  return (
    <GeneralSettingsClient
      {...{
        messages: { noEqualPasswordsError },
        primaryMsgSchemaConfigs: iam.primaryMsgSchemaConfigs,
      }}
    />
  )
}
