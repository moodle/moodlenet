import { createHttpServer } from './http-server.mjs' //FIXME: circular dep

export const env = getEnv({} /* shell.env */)
export const httpServer = await createHttpServer()

type Env = {
  port: number
}
function getEnv(rawExtEnv: any): Env {
  const env: Env = {
    port: Number(process.env.MOODLENET_HTTP_SERVER_PORT) || 8080,
    ...rawExtEnv,
  }
  //FIXME: implement checks ?
  return env
}
