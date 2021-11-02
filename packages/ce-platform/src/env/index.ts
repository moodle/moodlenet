import db from './db'
import fsAsset from './fs'
import http from './http'
import jwt from './jwt'
import nodemailer from './nodemailer'
import mnStatic from './webApp'

const env = {
  db,
  fsAsset,
  http,
  jwt,
  nodemailer,
  mnStatic,
}
export type DefaultDeployEnv = typeof env

export default env
