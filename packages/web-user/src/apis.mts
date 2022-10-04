import { defApi } from '@moodlenet/core'
import { createProfile } from './lib.mjs'
import { CreateRequest } from './types.mjs'

export default {
  createProfile: defApi(
    _ctx => (createRequest: CreateRequest) => {
      return createProfile(createRequest)
    },
    () => true,
  ),
}
