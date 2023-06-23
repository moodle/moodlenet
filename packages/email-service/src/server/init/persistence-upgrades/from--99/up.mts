import assert from 'assert'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import type { MailerCfg } from '../../../types.mjs'
import { kvStore } from '../../kvStore.mjs'
import type { MailerCfgVNaN } from '../from-NaN/up.mjs'

const __dirname = new URL('.', import.meta.url).pathname
const defaultEmailTemplate = await readFile(
  resolve(__dirname, '..', '..', '..', '..', '..', 'email-templates/default-layout.html'),
  'utf-8',
)

const mailerCfgVNaN: MailerCfgVNaN | undefined = (await kvStore.get('mailerCfg', '')).value
assert(mailerCfgVNaN)

const mailerCfg: MailerCfg = {
  ...mailerCfgVNaN,
  baseEmailLayoutTemplateVars: {
    instanceLogoUrl: 'https://i.ibb.co/cDZ97rk/Moodle-Net-Logo-Colour-RGB.png',
    copyright: 'Copyright © 2021 Moodle Pty Ltd, All rights reserved.',
    location: 'PO Box 303, West Perth WA 6872, Australia',
    locationUrl:
      'http://mailsend.moodle.com/track/click/30829846/www.google.com?p=eyJzIjoia2ZVN0M2eHBsV2VxVGxfQkVMbmxRcEhNVWpBIiwidiI6MSwicCI6IntcInVcIjozMDgyOTg0NixcInZcIjoxLFwidXJsXCI6XCJodHRwczpcXFwvXFxcL3d3dy5nb29nbGUuY29tXFxcL21hcHNcXFwvcGxhY2VcXFwvTW9vZGxlXFxcL0AtMzEuOTQ4OTkxOSwxMTUuODQwMzkyMywxNXpcXFwvZGF0YT0hNG01ITNtNCExczB4MDoweDJiZmY3YmVkZjQzYjRmYzchOG0yITNkLTMxLjk0ODk5MTkhNGQxMTUuODQwMzkyM1wiLFwiaWRcIjpcIjgwYjI4NzUzNGFmMDQ5ZGY4NjhiNjBkYjRjZDg2OGNkXCIsXCJ1cmxfaWRzXCI6W1wiNjdhMmU4MjRhOTNkOGNhODE3YzhiYmY1YTliNzhiMTM0NzczM2MxYVwiXX0ifQ',
  },
}
kvStore.set('mailerCfg', '', mailerCfg)
kvStore.set('email-layout', '', defaultEmailTemplate)

export default -98
