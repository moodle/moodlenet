import { defApi } from '@moodlenet/core'
import { editProfile, getProfile, createProfile } from './lib.mjs'
import { EditRequest, GetRequest, CreateRequest } from './types.mjs'

export default {
  createProfile: defApi(
    _ctx => (createRequest: CreateRequest) => {
      return createProfile(createRequest)
    },
    () => true,
  ),
  editProfile: defApi(
    _ctx => (editRequest: EditRequest) => {
      return editProfile(editRequest)
    },
    () => true,
  ),
  getProfile: defApi(
    _ctx => (getRequest: GetRequest) => {
      return getProfile(getRequest)
    },
    () => true,
  ),
}
