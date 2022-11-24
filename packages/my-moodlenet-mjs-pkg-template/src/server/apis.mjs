import { defApi } from '@moodlenet/core'

export default {
  helloWorldApi: defApi(
    ctx => async (stringParam, numberParam) => {
      return {
        msg: `Hello world`,
        stringParam,
        numberParam,
      }
    },
    (stringParam, numberParam) => {
      const valid = typeof stringParam === 'string' && typeof numberParam === 'number'
      return {
        valid,
        msg: valid ? undefined : 'bad params',
      }
    },
  ),
}
