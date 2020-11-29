import * as Yup from 'yup'

const HTTP_PORT = process.env.HTTP_GRAPHQL_PORT

interface HttpEnv {
  port: number
}

const Validator = Yup.object<HttpEnv>({
  port: Yup.number().required().default(8080),
})

export const env = Validator.validateSync({
  port: HTTP_PORT,
})!
