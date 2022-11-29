import { defApi } from '@moodlenet/core'
import { createProfile, editProfile, getProfile } from './lib.mjs'
import { CreateRequest, EditRequest } from './types.mjs'

export default {
  createProfile: defApi(
    _ctx => (createRequest: CreateRequest) => {
      return createProfile(createRequest)
    },
    () => true,
  ),
  editProfile: defApi(
    _ctx => (key: string, createRequest: EditRequest) => {
      return editProfile(key, createRequest)
    },
    () => true,
  ),
  getProfile: defApi(
    _ctx => (key: string) => {
      return getProfile(key)
    },
    () => true,
  ),
}
