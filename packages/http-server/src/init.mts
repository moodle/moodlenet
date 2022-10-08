import { createHttpServer } from './http-server.mjs' //FIXME: circular dep

export const env = getEnv({} /* shell.env */)
export const httpServer = createHttpServer()

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
