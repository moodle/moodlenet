import { defApi } from '@moodlenet/core'
// import * as jwt from './lib/jwt.mjs'
import * as std from './lib/std-encription.mjs'
export * from './lib/std-encription.mjs'
export default {
  // jwt: {
  //   sign: defApi(
  //     _ctx => (signArgs: jwt.SignArgs) => {
  //       return jwt.sign(signArgs)
  //     },
  //     () => true,
  //   ),
  //   verify: defApi(
  //     _ctx => (verifyArgs: jwt.VerifyArgs) => {
  //       return jwt.verify(verifyArgs)
  //     },
  //     () => true,
  //   ),
  // },
  std: {
    decrypt: defApi(
      _ctx => (decryptArgs: std.DecryptArgs) => {
        return std.decrypt(decryptArgs)
      },
      () => true,
    ),
    encrypt: defApi(
      _ctx => (encryptArgs: std.EncryptArgs) => {
        return std.encrypt(encryptArgs)
      },
      () => true,
    ),
  },
}
