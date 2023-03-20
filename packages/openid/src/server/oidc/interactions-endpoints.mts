import {
  ErrorRequestHandler,
  mountApp,
  RequestHandler,
  urlencoded,
} from '@moodlenet/http-server/server'
// import Account from './account.mjs'

import assert, { AssertionError } from 'assert'
import { InteractionResults } from 'oidc-provider'
import { shell } from '../shell.mjs'
import { openIdProvider } from './provider.mjs'
const setNoCache: RequestHandler = (_req, res, next) => {
  res.set('cache-control', 'no-store')
  next()
}
const body = urlencoded({ extended: false })
// https://github.com/hyunrealshadow/oidc-provider/blob/dc6bde1e45875d69b7dfd53ef5abf79d0634bc0a/example/routes/express.js
shell.call(mountApp)({
  getApp(express) {
    const app = express()

    app.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => {
      console.log('interaction LOGIN   ', req.params.uid)
      try {
        const {
          prompt: { name },
        } = await openIdProvider.interactionDetails(req, res)
        assert.equal(name, 'login')
        // const account = await Account.findByLogin(req.body.login)

        const result = {
          login: {
            accountId: '1111',
          },
        }

        await openIdProvider.interactionFinished(req, res, result, {
          mergeWithLastSubmission: false,
        })
      } catch (err) {
        console.log('LOGIN ERR', err)
        next(err)
      }
    })

    app.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => {
      console.log('interaction CONFIRM   ', req.params.uid)
      try {
        const interactionDetails = await openIdProvider.interactionDetails(req, res)
        const {
          prompt: { name, details },
          params,
          session,
        } = interactionDetails
        assert(session, 'no session found')
        const { accountId } = session
        assert.equal(name, 'consent')

        const { grantId } = interactionDetails
        const grant = grantId
          ? // we'll be modifying existing grant in existing session
            await openIdProvider.Grant.find(grantId)
          : (() => {
              assert(typeof params.client_id === 'string' || params.client_id === undefined)
              // we're establishing a new grant
              return new openIdProvider.Grant({
                accountId,
                clientId: params.client_id,
              })
            })()

        assert(grant)

        if (Array.isArray(details.missingOIDCScope)) {
          grant.addOIDCScope(details.missingOIDCScope.join(' '))
        }
        if (Array.isArray(details.missingOIDCClaims)) {
          grant.addOIDCClaims(details.missingOIDCClaims)
        }
        if (details.missingResourceScopes) {
          for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
            grant.addResourceScope(indicator, scopes.join(' '))
          }
        }

        const savedGrantId = await grant.save()

        const result: InteractionResults = {
          consent: !interactionDetails.grantId
            ? {
                // we don't have to pass grantId to consent, we're just modifying existing one
                grantId: savedGrantId,
              }
            : {},
        }

        await openIdProvider.interactionFinished(req, res, result, {
          mergeWithLastSubmission: true,
        })
      } catch (err) {
        console.log('CONFIRM ERR', err)
        next(err)
      }
    })

    app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
      try {
        const result = {
          error: 'access_denied',
          error_description: 'End-User aborted interaction',
        }
        await openIdProvider.interactionFinished(req, res, result, {
          mergeWithLastSubmission: false,
        })
      } catch (err) {
        next(err)
      }
    })

    const ErrorRequestHandler: ErrorRequestHandler = (err, _req, _res, next) => {
      if (err instanceof AssertionError) {
        console.error('OIDC interaction-endpoints Error Handler', err)
        // handle interaction expired / session not found error
      }
      next(err)
    }
    app.use(ErrorRequestHandler)

    return app
  },
  mountOnAbsPath: '/.openid',
})
