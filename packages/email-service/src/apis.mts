import { defApi } from '@moodlenet/core'
import { send } from './lib.mjs'
import { EmailObj, SendResp } from './types.mjs'
export { EmailObj, SendResp } from './types.mjs'

export default {
  send: defApi(
    _ctx =>
      async ({ emailObj }: { emailObj: EmailObj }): Promise<SendResp> => {
        return send({ emailObj })
      },
    () => true,
  ),
}
