import { getMod } from '../../../../lib/server/session-access'
import { GeneralSettingsClient } from './general.client'

export default async function GeneralPage() {
  const {
    moodle: {
      iam: {
        v1_0: { pri },
      },
    },
  } = getMod()
  const { iam } = await pri.configs.read()

  return (
    <GeneralSettingsClient
      {...{
        primaryMsgSchemaConfigs: iam.primaryMsgSchemaConfigs,
      }}
    />
  )
}
