import { defApi } from '@moodlenet/core'
import { getOrgData, setOrgData } from './lib.mjs'
import { OrganizationData } from './types.mjs'

export default {
  setOrgData: defApi(
    _ctx =>
      async ({ orgData }: { orgData: OrganizationData }) => {
        return setOrgData({ orgData })
      },
    _args => true,
  ),
  getOrgData: defApi(
    _ctx => async () => {
      return getOrgData()
    },
    _args => true,
  ),
}
