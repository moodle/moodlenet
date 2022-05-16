import crypto from './crypto'
import db from './db'
import fsAsset from './fs'
import http from './http'
import nodemailer from './nodemailer'
import mnStatic from './webApp'

const env = {
  db,
  fsAsset,
  http,
  crypto,
  nodemailer,
  mnStatic,
}
export type DefaultDeployEnv = typeof env

export default env
