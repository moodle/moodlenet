import { priAccess } from '../../../../lib/server/session-access'
import { GeneralClient, GeneralFormValues } from './general.client'
import { fetchMakeAdminGeneralSchemaDeps } from './general.server'

export default async function GeneralPage() {
  const makeAdminGeneralSchemaDeps = await fetchMakeAdminGeneralSchemaDeps()
  const { moodlenet, org } = await priAccess().moodle.netWebappNextjs.pri.moodlenet.info()
  const generalFormValues: GeneralFormValues = {
    name: org.name,
    copyright: org.copyright,
    title: moodlenet.title,
    physicalAddress: org.physicalAddress,
    subtitle: moodlenet.subtitle,
    websiteUrl: org.websiteUrl,
  }
  return (
    <GeneralClient
      makeAdminGeneralSchemaDeps={makeAdminGeneralSchemaDeps}
      generalFormValues={generalFormValues}
    />
  )
}
