import { primary_session } from '@moodle/domain'
import type { CryptoDefaultEnv } from '@moodle/sec-crypto-default'
import type { v1_0 as arango_v1_0 } from '@moodle/sec-db-arango'
import type { NodemailerSecEnv } from '@moodle/sec-email-nodemailer'

export type EnvProvider = (primary_session: primary_session) => EnvType | Promise<EnvType>
export interface EnvType {
  arango_db: arango_v1_0.ArangoDbSecEnv
  crypto: CryptoDefaultEnv
  nodemailer: NodemailerSecEnv
}
