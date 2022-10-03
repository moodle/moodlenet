import { defApi } from '@moodlenet/core'

export const ciccio = defApi(
  ctx =>
    async function <T>(_: { str: string; x: T }) {
      console.log('mamma ciccio : from', ctx.caller.pkgId.name)
      return { success: true, x: _.x, str: _.str }
    },
  function validate(...args) {
    // console.log(args)
    return !!args.length
  },
)
