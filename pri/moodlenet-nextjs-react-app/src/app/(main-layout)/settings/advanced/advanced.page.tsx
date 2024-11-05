'use server'
import { getSiteGeneralInfo } from '../../../../lib/server/siteGeneralInfo'
import { AdvancedSettings } from './advanced.client'
import './advanced.style.scss'

export default async function AdvancedPage() {
  const { org } = await getSiteGeneralInfo()
  return <AdvancedSettings orgName={org.name} />
}
