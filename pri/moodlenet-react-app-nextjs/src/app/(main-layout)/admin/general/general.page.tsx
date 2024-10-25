import { getSiteGeneralInfo } from '../../../../lib/server/siteGeneralInfo'
import { GeneralClient, GeneralFormValues } from './general.client'

export default async function GeneralPage() {
  const { moodlenet, org } = await getSiteGeneralInfo()
  const generalFormValues: GeneralFormValues = {
    name: org.name,
    copyright: org.copyright,
    title: moodlenet.title,
    physicalAddress: org.physicalAddress,
    subtitle: moodlenet.subtitle,
    websiteUrl: org.websiteUrl,
  }
  return <GeneralClient generalFormValues={generalFormValues} />
}
