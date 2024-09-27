import { DomainDeployments, access_session } from '@moodle/lib-ddd'
import type { CryptoDefaultEnv } from '@moodle/sec-crypto-default'
import type { ArangoDbSecEnv } from '@moodle/sec-db-arango'
import { DbMigrateConfig } from '@moodle/sec-db-arango/migrate'
import type { NodemailerSecEnv } from '@moodle/sec-email-nodemailer'
import type dotenv from 'dotenv'
import type { DotenvExpandOutput } from 'dotenv-expand'

export type EnvProviderResult = EnvResult | Promise<EnvResult>

export type migrate_fn = (_: {
  env: Env
  configs: {
    db: DbMigrateConfig
  }
}) => Promise<migration_status>

export type EnvProvider = (_: {
  access_session: access_session
  migrate: migrate_fn
  loadDotEnv: dotEnvLoader
}) => EnvProviderResult

export type dotEnvLoader = (options?: dotenv.DotenvConfigOptions) => DotenvExpandOutput

export interface EnvResult {
  env: Env
  migration_status: Promise<migration_status>
}

export interface Env {
  arango_db: ArangoDbSecEnv
  crypto: CryptoDefaultEnv
  nodemailer: NodemailerSecEnv
  deployments: DomainDeployments
}
type migration_status = unknown // d_u<{done:unknown}, 'status'>
