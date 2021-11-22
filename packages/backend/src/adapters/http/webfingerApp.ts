import { nodeIdentifierSlug2HomeUrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import express from 'express'
import { port as getNodePort } from '../../ports/content-graph/node/read'
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

export type GQLAppConfig = {}
export const createWebfingerApp = async () => {
  const app = express()
  const {
    localOrg: { domain },
    publicUrl,
  } = await localOrgInfo.adapter()
  const acctResourceParam = new RegExp(`^acct:[a-zA-Z0-9\.\_\-]+@${domain}$`)
  app.get<{}, WebFingerResp | string, any, { resource: string }>('/webfinger', async (req, res) => {
    const resParam = req.query.resource
    if ('string' !== typeof resParam || !acctResourceParam.test(resParam)) {
      res.sendStatus(400).send(`Bad Request resource:${JSON.stringify(resParam)}`)
      return
    }

    const acct = resParam.split(':')[1]!
    const userSlug = acct.split('@')[0]!

    const profile = await getNodePort({
      sessionEnv: req.mnHttpContext.sessionEnv,
      identifier: { _slug: userSlug, _type: 'Profile' },
    })

    if (!profile) {
      res.sendStatus(404).send(`user ${acct} not found`)
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
