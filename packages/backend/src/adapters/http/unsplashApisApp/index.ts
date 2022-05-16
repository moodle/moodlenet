import express from 'express'
import { getImageFromKeywords, getUnsplashImages } from './lib'
;(global as any).fetch = require('node-fetch')
export type Config = {
  accessKey?: string
}
export const createUnsplashApisApp = ({ accessKey }: Config) => {
  const app = express()
  if (!accessKey) {
    app.all('*', async (_req, res) => {
      res.status(404).end('service not available')
    })
    return app
  }
  app.get('/getUnsplashImages', async (req, res) => {
    if (!req.mnHttpContext.sessionEnv.authId) {
      return res.status(401).end('logged users only can use this service')
    }
    const query = req.query.query?.toString()
    const page = Number(req.query.page?.toString() ?? '1')
    if (!query) {
      res.status(400).end('need a query string')
      return
    }
    const resp = await getUnsplashImages({ accessKey, page, query })
    res.json(resp)
  })
  app.get('/getImageFromKeywords', async (req, res) => {
    if (!req.mnHttpContext.sessionEnv.authId) {
      return res.status(401).end('logged users only can use this service')
    }
    const name = req.query.name?.toString() ?? ''
    const description = req.query.description?.toString() ?? ''
    const subject = req.query.subject?.toString() ?? ''
    if (!name) {
      res.status(400).end('need an entity name at least')
      return
    }
    const resp = await getImageFromKeywords({ accessKey, description, name, subject })
    res.json(resp)
  })

  return app
}
