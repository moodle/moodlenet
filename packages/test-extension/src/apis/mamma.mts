import { defApi } from '@moodlenet/core'
import { inspect } from 'util'

export const ciccio = defApi(
  ctx =>
    async function <T>(_: { str: string; x: T }) {
      console.log('mamma ciccio : ctx', inspect(ctx))
      return { success: true, x: _.x, str: _.str }
    },
  function validate(...args) {
    return !!args.length
  },
)
