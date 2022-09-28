import { defApi } from '@moodlenet/core'
import { send } from './lib.mjs'
import { EmailObj } from './types.mjs'

export default {
  send: defApi(
    _ctx =>
      async ({ emailObj }: { emailObj: EmailObj }) => {
        return send({ emailObj })
      },
    () => true,
  ),
}
