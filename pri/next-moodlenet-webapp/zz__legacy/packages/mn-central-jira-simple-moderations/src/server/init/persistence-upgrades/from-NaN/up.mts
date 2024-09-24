import { kvStore } from '../../kvStore.mjs'

export default 1

kvStore.set('service-configs', '', {
  publishingApproval: {
    daysIntervalBeforeRequests: 10,
    resourceAmount: 5,
    jira: {},
  },
})
