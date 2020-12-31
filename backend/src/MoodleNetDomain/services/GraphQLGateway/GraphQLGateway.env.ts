import * as Yup from 'yup'
import { VerifyOptions } from 'jsonwebtoken'
import sshpk from 'sshpk'

// ^ HTTP
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
// $  HTTP

// ^ JWT
export const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!

sshpk.parseKey(JWT_PUBLIC_KEY!, 'pem')
export const jwtVerifyOpts: VerifyOptions = {
  // algorithms: ['RS256'],
  // complete: true,
}
// $ JWT
