// import { x } from '@moodle/domain'
export async function register(...args: unknown[]) {
  // x('HHHHHHHHHEEEEEEEEEEEEEEEELLLLLLLLLLLLLLL')

  // const sessionContext = (await import('./lib/mock/server/session-ctx/mock')).default

  // ;(process as any).sessionContext = sessionContext
  // return (process as any).sessionContext(_headers)
  const env_mod_name = String(process.env.MOODLENET_NEXT_JS_SESSION_CTX_MODULE)
  console.log({ env_mod_name })
  // const fact_mod = await (env_mod_name
  //   ? import('/home/alec/my-app/sc')
  //   : import('#lib/mock/server/session-ctx/mock'))

  // ;(process as any).sc_fact = fact_mod.default

  console.log('registering', args)
}
