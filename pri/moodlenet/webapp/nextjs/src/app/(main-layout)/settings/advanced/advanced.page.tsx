'use server'
import { getMod } from '../../../../lib/server/session-access'
import { AdvancedSettings } from './advanced.client'
import './advanced.style.scss'

export default async function AdvancedPage() {
  const {
    moodle: {
      org: {
        v1_0: {
          pri: { configs },
        },
      },
    },
  } = getMod()
  const {
    configs: {
      info: { name },
    },
  } = await configs.read()
  return <AdvancedSettings instanceName={name} />
}
