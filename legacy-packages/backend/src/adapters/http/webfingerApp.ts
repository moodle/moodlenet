import { nodeIdentifierSlug2HomeUrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import express from 'express'
import { graphOperators } from '../../ports/content-graph/graph-lang/graph'
import { adapter as getNodeAdapter } from '../../ports/content-graph/node/read'
import * as localOrgInfo from '../../ports/system/localOrg/info'

export type WebFingerResp = {
  subject: string
  aliases: string[]
  links: [
    {
      rel: 'http://webfinger.example/rel/profile-page'
      href: string
    },
  ]
}

export const createWebfingerApp = async () => {
  const app = express()
  const {
    localOrg: { domain },
    publicUrl,
  } = await localOrgInfo.adapter()
  const acctResourceParam = new RegExp(`^acct:[a-zA-Z0-9._-]+@${domain}$`)
  app.get<unknown, WebFingerResp | string, unknown, { resource: string }>('/webfinger', async (req, res) => {
    const resParam = req.query.resource
    if ('string' !== typeof resParam || !acctResourceParam.test(resParam)) {
      res.status(400).send(`Bad Request resource:${JSON.stringify(resParam)}`)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const acct = resParam.split(':')[1]!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userSlug = acct.split('@')[0]!
    const { graphNode } = await graphOperators()

    const profile = await getNodeAdapter({
      nodeId: graphNode({ _slug: userSlug, _type: 'Profile' }),
      assertions: {},
    })

    if (!profile) {
      res.status(404).send(`user ${acct} not found`)
      return
    }
    const profilePagePath = nodeIdentifierSlug2HomeUrlPath(profile)
    const profileUrl = `${publicUrl}${profilePagePath}`
    const resp: WebFingerResp = {
      subject: profileUrl,
      aliases: [profileUrl],
      links: [
        {
          rel: 'http://webfinger.example/rel/profile-page',
          href: profileUrl,
        },
      ],
    }

    res.send(resp)
  })
  return app
}
