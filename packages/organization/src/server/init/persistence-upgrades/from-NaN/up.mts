import { kvStore } from '../../kvStore.mjs'

await kvStore.set('organizationData', '', {
  instanceName: 'MoodleNet',
  landingSubtitle: 'Find, share and curate open educational resources',
  landingTitle: 'Search for resources, subjects, collections or people',
})

export default 1
