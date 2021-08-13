import { nodeIdentifierSlug2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import express from 'express'
import { QMino } from '../../lib/qmino'
import { getBySlug } from '../../ports/content-graph/node'

export type WebFingerResp = {
  subject: string
  links: [
    {
      rel: 'http://webfinger.example/rel/profile-page'
      href: string
    },
  ]
}

export type GQLAppConfig = {
  qmino: QMino
  domain: string
}
export const createWebfingerApp = ({ qmino, domain }: GQLAppConfig) => {
  const app = express()
  const acctResourceParam = new RegExp(`^acct:[a-zA-Z0-9\.\_\-]+@${domain}$`)
  app.get<{}, WebFingerResp | string, any, { resource: string }>('/webfinger', async (req, res) => {
    const resParam = req.query.resource
    if ('string' !== typeof resParam || !acctResourceParam.test(resParam)) {
      res.sendStatus(400).send(`Bad Request resource:${JSON.stringify(resParam)}`)
      return
    }

    const acct = resParam.split(':')[1]!
    const userSlug = acct.split('@')[0]!

    const profile = await qmino.query(
      getBySlug({ _slug: userSlug, _type: 'Profile', env: req.mnHttpContext.authSessionEnv }),
      {
        timeout: 5000,
      },
    )

    if (!profile) {
      res.sendStatus(404).send(`user ${acct} not found`)
      return
    }
    const profilePagePath = nodeIdentifierSlug2UrlPath(profile)
    const resp: WebFingerResp = {
      subject: `MoodleNet user: ${profile.name}`,
      links: [
        {
          rel: 'http://webfinger.example/rel/profile-page',
          href: `https://${domain}${profilePagePath}`, //FIXME: hardcoded protocol for MVP !!
        },
      ],
    }

    res.send(resp)
  })
  return app
}
