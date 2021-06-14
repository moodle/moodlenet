import db from './db'
import fsAsset from './fs'
import http from './http'
import jwt from './jwt'
import nodemailer from './nodemailer'

const env = {
  db,
  fsAsset,
  http,
  jwt,
  nodemailer,
}
export type DefaultDeployEnv = typeof env

export default env
