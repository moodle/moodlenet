import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { KeyValueStoreExtDef } from '@moodlenet/key-value-store'
import assert from 'assert'
import crypto from 'crypto'
import JWT, { Jwt, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'
import keypair from 'keypair'
const DEFAULT_ENC: BufferEncoding = 'base64url'
export type CryptoExt = ExtDef<
  '@moodlenet/crypto',
  '0.1.0',
  void,
  {
    signJwt: SubTopo<{ payload: any; signOpts?: SignOptions }, { jwt: string }>
    verifyJwt: SubTopo<{ jwt: string; verifyOpts?: VerifyOptions }, { payload: Jwt | JwtPayload | string }>
    encrypt: SubTopo<{ payload: string; enc?: BufferEncoding }, { encrypted: string }>
    decrypt: SubTopo<{ encrypted: string; enc?: BufferEncoding }, { valid: true; payload: string } | { valid: false }>
  }
>
type KVStoreTypes = {
  keypairs: {
    publicKey: string
    privateKey: string
  }
}
const ext: Ext<CryptoExt, [CoreExt, KeyValueStoreExtDef]> = {
  name: '@moodlenet/crypto',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/key-value-store@0.1.0'],
  async connect(shell) {
    const [, kvStorePkg] = shell.deps
    const kvStore = await kvStorePkg.plug.getStore<KVStoreTypes>()

    return {
      async install() {
        const { public: publicKey, private: privateKey } = keypair({ bits: 2048 })
        kvStore.set('keypairs', '', { privateKey, publicKey })
      },
      deploy() {
        // shell.expose({})

        shell.provide.services({
          async signJwt({ payload, signOpts }) {
            const { privateKey } = await getKeys()
            const jwt = JWT.sign(payload, privateKey, signOpts)
            return { jwt }
          },
          async verifyJwt({ jwt, verifyOpts }) {
            const { publicKey } = await getKeys()
            const payload = JWT.verify(jwt, publicKey, verifyOpts)
            return { payload }
          },
          async decrypt({ encrypted, enc = DEFAULT_ENC }) {
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

              return { valid: true, payload }
            } catch {
              return { valid: false }
            }
          },
          async encrypt({ payload, enc = DEFAULT_ENC }) {
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
          },
        })
        return {}
        async function getKeys() {
          const { value: pair } = await kvStore.get('keypairs', '')
          assert(pair, 'No key-pair found !')
          return pair
        }
      },
    }
  },
}

export default ext
