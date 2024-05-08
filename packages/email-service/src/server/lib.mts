import { renderAsync } from '@react-email/render'
import assert from 'assert'
import { kvStore } from './init/kvStore.mjs'

import type {
  EmailContentProps,
  EmailOrganizationProps,
} from '@moodlenet/component-library/email-templates'
import { EmailLayout } from '@moodlenet/component-library/email-templates'
import { getOrgData } from '@moodlenet/organization/server'
import { getAppearance, getWebappUrl } from '@moodlenet/react-app/server'
export type { SentMessageInfo } from 'nodemailer'

const mailerCfg = (await kvStore.get('mailerCfg', '')).value
assert(mailerCfg, 'missing mailerCfg:: record in KeyValueStore')
export async function renderEmailTemplate({
  content,
}: {
  content: EmailContentProps
}): Promise<string> {
  const orgData = await getOrgData()
  const webapp = await getAppearance()
  const organization: EmailOrganizationProps = {
    name: orgData.data.instanceName,
    logoOnClickUrl: getWebappUrl(),
    logoSrc: webapp.data.logo,
    copyright: orgData.data.copyright,
    location: {
      address: orgData.data.locationAddress,
      url: orgData.data.locationUrl,
    },
  }
  const html = await renderAsync(
    EmailLayout({
      organization,
      content,
    }),
  )
  return html
}
