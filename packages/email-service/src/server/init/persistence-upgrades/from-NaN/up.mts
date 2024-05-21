import { instanceDomain } from '@moodlenet/core'
import { URL } from 'url'
import type { MailerCfg } from '../../../types.mjs'
import { kvStore } from '../../kvStore.mjs'

// const __dirname = dirname(fileURLToPath(import.meta.url))
// const defaultEmailTemplate = await readFile(
//   resolve(__dirname, '..', '..', '..', '..', '..', 'email-templates/default-layout.html'),
//   'utf-8',
// )
const instanceHostname = new URL(instanceDomain).hostname
const mailerCfg: MailerCfg = {
  defaultFrom: `noreply@${instanceHostname}`,
  defaultReplyTo: `noreply@${instanceHostname}`,
  baseEmailLayoutTemplateVars: {
    instanceLogoUrl: 'https://i.ibb.co/cDZ97rk/Moodle-Net-Logo-Colour-RGB.png',
    copyright: 'Copyright © 2021 Moodle Pty Ltd, All rights reserved.',
    location: 'PO Box 303, West Perth WA 6872, Australia',
    locationUrl: '',
  },
}

kvStore.set('mailerCfg', '', mailerCfg)
// kvStore.set('email-layout', '', defaultEmailTemplate)

export default 1
