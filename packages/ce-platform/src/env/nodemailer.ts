const SMTP = process.env.SMTP

if (!SMTP) {
  console.error('Nodemailer Env:')
  console.error({ SMTP })
  throw new Error(`some env missing or invalid`)
}

const nodemailerEnv = {
  smtp: SMTP,
}

export type NodemailerEnv = typeof nodemailerEnv

export default nodemailerEnv
