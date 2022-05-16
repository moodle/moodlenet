const HTTP_PORT = Number(process.env.HTTP_PORT) || 8080
const PUBLIC_URL_PROTOCOL = process.env.PUBLIC_URL_PROTOCOL

if (!(PUBLIC_URL_PROTOCOL && HTTP_PORT)) {
  console.error('HTTP Env:')
  console.error({ PUBLIC_URL_PROTOCOL, HTTP_PORT })
  throw new Error(`some env missing or invalid`)
}

const httpenv = {
  publicUrlProtocol: PUBLIC_URL_PROTOCOL,
  port: HTTP_PORT,
}

export type HTTPEnv = typeof httpenv

export default httpenv
