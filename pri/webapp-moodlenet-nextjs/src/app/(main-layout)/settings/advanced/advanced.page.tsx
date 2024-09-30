'use server'
import { priAccess } from '../../../../lib/server/session-access'
import { AdvancedSettings } from './advanced.client'
import './advanced.style.scss'

export default async function AdvancedPage() {
  const { org } = await priAccess().netWebappNextjs.moodlenet.info()

  return <AdvancedSettings orgName={org.name} />
}
