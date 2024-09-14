import { primary_session } from '@moodle/domain'
import { EnvProvider, EnvType } from './types'
import { map } from '@moodle/lib-types'
import { join } from 'path'

const envs: map<EnvType> = {}
export async function getEnv(primary_session: primary_session) {
  const { domain } = primary_session
  const foundEnv = envs[domain]
  if (foundEnv) {
    return foundEnv
  }
  const envProvidersDir = process.env.MOODLE_ENV_PROVIDERS_DIR ?? join(process.cwd(), '.env')
  const envProviderMod: { default: EnvProvider } = await import(
    join(envProvidersDir, domain, 'env-provider.mjs')
  )

  const env = await envProviderMod.default(primary_session)
  return env
}
