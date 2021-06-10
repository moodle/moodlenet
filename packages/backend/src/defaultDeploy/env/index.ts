import db from './db'
import fsAsset from './fs'
import http from './http'
import jwt from './jwt'
import mailgun from './mailgun'

const env = {
  db,
  fsAsset,
  http,
  jwt,
  mailgun,
}
export type DefaultDeployEnv = typeof env

export default env
