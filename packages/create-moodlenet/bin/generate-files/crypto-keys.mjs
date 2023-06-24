import { writeFile } from 'fs/promises'
import * as jose from 'jose'
import { crypto } from '../env.mjs'

try {
  await Promise.all([
    open(crypto.defaultKeyFilenames.private, 'r'),
    open(crypto.defaultKeyFilenames.public, 'r'),
  ])
} catch {
  const keysLike = await jose.generateKeyPair(crypto.alg, { modulusLength: 2048 /* minimum */ })

  //const privateKey = await jose.importPKCS8(keystr.privateKey, alg)
  // console.log(inspect({ keysLike1 }))
  const keystr = {
    privateKey: await jose.exportPKCS8(keysLike.privateKey),
    publicKey: await jose.exportSPKI(keysLike.publicKey),
  }
  await writeFile(crypto.defaultKeyFilenames.private, keystr.privateKey, 'utf-8')
  await writeFile(crypto.defaultKeyFilenames.public, keystr.publicKey, 'utf-8')
}
