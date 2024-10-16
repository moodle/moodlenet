import { getSiteGeneralInfo } from '../../../../lib/server/siteGeneralInfo'
import { GeneralClient, GeneralFormValues } from './general.client'

export default async function GeneralPage() {
  const { net, org } = await getSiteGeneralInfo()
  const generalFormValues: GeneralFormValues = {
    name: org.name,
    copyright: org.copyright,
    title: net.title,
    physicalAddress: org.physicalAddress,
    subtitle: net.subtitle,
    websiteUrl: org.websiteUrl,
  }
  return <GeneralClient generalFormValues={generalFormValues} />
}
