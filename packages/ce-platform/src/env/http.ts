const HTTP_PORT = Number(process.env.HTTP_PORT) || 8080
const PUBLIC_URL = process.env.PUBLIC_URL

if (!(PUBLIC_URL && HTTP_PORT)) {
  console.error('HTTP Env:')
  console.log({ PUBLIC_URL, HTTP_PORT })
  throw new Error(`some env missing or invalid`)
}

const httpenv = {
  publicUrl: PUBLIC_URL,
  port: HTTP_PORT,
}

export type HTTPEnv = typeof httpenv

export default httpenv
