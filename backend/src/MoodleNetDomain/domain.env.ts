import { VerifyOptions } from 'jsonwebtoken'
import sshpk from 'sshpk'

export const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!
sshpk.parseKey(JWT_PUBLIC_KEY!, 'pem')
export const jwtVerifyOpts: VerifyOptions = {
  // algorithms: ['RS256'],
  // complete: true,
}
