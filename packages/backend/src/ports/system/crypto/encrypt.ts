import { adapter as encryptAdapter } from './jwtSigner'
import { adapter as decryptAdapter } from './jwtVerifierAdapter'

declare const ENC_STR_SYM: unique symbol
export type EncryptedString = { [ENC_STR_SYM]: typeof ENC_STR_SYM }
type _ActualEncryptedString = {
  str: string
}

const isEncryptedString = (_: any): _ is _ActualEncryptedString => !!_ && 'string' === typeof _.str

export const encryptString = async (str: string, expiresSecs = 20) => {
  const encryptedObj: _ActualEncryptedString = { str }
  return (await encryptAdapter(encryptedObj, expiresSecs)) as unknown as EncryptedString
}
export const decryptString = async (encStr: EncryptedString) => {
  const res = await decryptAdapter(encStr as unknown as string)

  if (!isEncryptedString(res)) {
    return null
  }
  return res.str
}
