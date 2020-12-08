import JWT from 'jsonwebtoken'
import { jwtVerifyOpts, JWT_PUBLIC_KEY } from './domain.env'

export const verifyJwt = (token: string) => {
  return JWT.verify(token, JWT_PUBLIC_KEY, jwtVerifyOpts)
}
