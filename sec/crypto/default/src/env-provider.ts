import { literal, number, object, string } from 'zod'

import { map } from '@moodle/lib-types'
import type { CryptoDefaultEnv } from './crypto-secondarys'

export type env_keys =
  | 'MOODLE_CRYPTO_PRIVATE_KEY'
  | 'MOODLE_CRYPTO_PUBLIC_KEY'
  | 'MOODLE_ARGON_OPTS_MEMORY_COST'
  | 'MOODLE_ARGON_OPTS_TIME_COST'
  | 'MOODLE_ARGON_OPTS_PARALLELISM'
  | 'MOODLE_ARGON_OPTS_TYPE'
export function provideCryptoDefaultEnv({ env }: { env: map<unknown, env_keys> }): CryptoDefaultEnv {
  function string_int_schema(def: number) {
    return string().transform(Number).pipe(number().positive().int().default(def))
  }
  const env_config = object({
    MOODLE_CRYPTO_PRIVATE_KEY: string(), //FIXME: apply key validations
    MOODLE_CRYPTO_PUBLIC_KEY: string(), //FIXME: apply key validations
    MOODLE_ARGON_OPTS_MEMORY_COST: string_int_schema(100000),
    MOODLE_ARGON_OPTS_TIME_COST: string_int_schema(8),
    MOODLE_ARGON_OPTS_PARALLELISM: string_int_schema(4),
    MOODLE_ARGON_OPTS_TYPE: string_int_schema(2)
      .pipe(literal(0).or(literal(1)).or(literal(2)))
      .optional(),
  }).parse({
    MOODLE_CRYPTO_PRIVATE_KEY: env.MOODLE_CRYPTO_PRIVATE_KEY,
    MOODLE_CRYPTO_PUBLIC_KEY: env.MOODLE_CRYPTO_PUBLIC_KEY,
    MOODLE_ARGON_OPTS_MEMORY_COST: env.MOODLE_ARGON_OPTS_MEMORY_COST,
    MOODLE_ARGON_OPTS_TIME_COST: env.MOODLE_ARGON_OPTS_TIME_COST,
    MOODLE_ARGON_OPTS_PARALLELISM: env.MOODLE_ARGON_OPTS_PARALLELISM,
    MOODLE_ARGON_OPTS_TYPE: env.MOODLE_ARGON_OPTS_TYPE,
  })

  const cryptoDefaultEnv: CryptoDefaultEnv = {
    argonOpts: {
      memoryCost: env_config.MOODLE_ARGON_OPTS_MEMORY_COST,
      timeCost: env_config.MOODLE_ARGON_OPTS_TIME_COST,
      parallelism: env_config.MOODLE_ARGON_OPTS_PARALLELISM,
      type: env_config.MOODLE_ARGON_OPTS_TYPE,
    },
    joseOpts: {
      alg: 'RS256',
      type: 'PKCS8',
      privateKeyStr: env_config.MOODLE_CRYPTO_PRIVATE_KEY,
      publicKeyStr: env_config.MOODLE_CRYPTO_PUBLIC_KEY,
    },
  }
  return cryptoDefaultEnv
}
