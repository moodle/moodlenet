import * as Yup from 'yup'
// ^ HTTP

interface HttpCfg {
  port: number
}

export const httpCfg = (): HttpCfg => {
  const HTTP_PORT = process.env.HTTP_GRAPHQL_PORT
  const Validator = Yup.object<HttpCfg>({
    port: Yup.number().required().default(8080),
  })

  const env = Validator.validateSync({
    port: HTTP_PORT,
  })!

  return env
}
// $  HTTP
