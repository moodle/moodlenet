import { nodeIdentifierSlug2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import express from 'express'
import { byIdentifier } from '../../ports/content-graph/node'
import { localDomainAdapter, publicUrlAdapter } from '../../ports/user-auth/adapters'

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
  const domain = await localDomainAdapter()
  const acctResourceParam = new RegExp(`^acct:[a-zA-Z0-9\.\_\-]+@${domain}$`)
  app.get<{}, WebFingerResp | string, any, { resource: string }>('/webfinger', async (req, res) => {
    const resParam = req.query.resource
    if ('string' !== typeof resParam || !acctResourceParam.test(resParam)) {
      res.sendStatus(400).send(`Bad Request resource:${JSON.stringify(resParam)}`)
      return
    }

    const acct = resParam.split(':')[1]!
    const userSlug = acct.split('@')[0]!

    const profile = await byIdentifier(req.mnHttpContext.sessionEnv, { _slug: userSlug, _type: 'Profile' })

    if (!profile) {
      res.sendStatus(404).send(`user ${acct} not found`)
      return
    }
    const profilePagePath = nodeIdentifierSlug2UrlPath(profile)
    const publicBaseUrl = await publicUrlAdapter()
    const profileUrl = `${publicBaseUrl}${profilePagePath}` //FIXME: hardcoded protocol for MVP !!
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
