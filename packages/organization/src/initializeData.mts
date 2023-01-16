import kvStore from './kvStore.mjs'

const { value: dataExists } = await kvStore.get('organizationData', '')

if (!dataExists) {
  await kvStore.set('organizationData', '', {
    instanceName: 'MoodleNet',
    landingSubtitle: 'Find, share and curate open educational resources',
    landingTitle: 'Search for resources, subjects, collections or people',
  })
}
