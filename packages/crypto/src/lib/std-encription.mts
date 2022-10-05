import crypto from 'crypto'
import { getKeys } from './utils.mjs'
const DEFAULT_ENC: BufferEncoding = 'base64url'

export type DecryptArgs = { encrypted: string; enc?: BufferEncoding }
export async function decrypt({ encrypted, enc = DEFAULT_ENC }: DecryptArgs) {
  const { privateKey } = await getKeys()
  try {
    const payload = crypto
      .privateDecrypt(
        {
          key: privateKey,
          // In order to decrypt the data, we need to specify the
          // same hashing function and padding scheme that we used to
          // encrypt the data in the previous step
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(encrypted, enc),
      )
      .toString()

    return { valid: true, payload } as const
  } catch {
    return { valid: false } as const
  }
}

export type EncryptArgs = { payload: string; enc?: BufferEncoding }
export async function encrypt({ payload, enc = DEFAULT_ENC }: EncryptArgs) {
  const { publicKey } = await getKeys()
  const encrypted = crypto
    .publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(payload),
    )
    .toString(enc)

  return { encrypted }
}
