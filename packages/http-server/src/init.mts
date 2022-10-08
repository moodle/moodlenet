import { createHttpServer } from './http-server.mjs'

export const httpServer = createHttpServer()

export const env = getEnv({} /* shell.env */)
type Env = {
  port: number
}
function getEnv(rawExtEnv: any): Env {
  const env: Env = {
    port: 8080,
    ...rawExtEnv,
  }
  //FIXME: implement checks ?
  return env
}
