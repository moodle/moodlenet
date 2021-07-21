import db from './db'
import fsAsset from './fs'
import http from './http'
import jwt from './jwt'
import mnStatic from './mnStatic'
import nodemailer from './nodemailer'

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
