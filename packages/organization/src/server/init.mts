import kvStoreFactory from '@moodlenet/key-value-store/server'
import fileStoreFactory from '@moodlenet/simple-file-store/server'
import { shell } from './shell.mjs'
import { KeyValueStoreData } from './types.mjs'

export const kvStore = await kvStoreFactory<KeyValueStoreData>(shell)

const { value: dataExists } = await kvStore.get('organizationData', '')

if (!dataExists) {
  await kvStore.set('organizationData', '', {
    instanceName: 'MoodleNet',
    landingSubtitle: 'Find, share and curate open educational resources',
    landingTitle: 'Search for resources, subjects, collections or people',
  })
}

// FIXME: REMOVE_ME vv
export const publicFiles = await fileStoreFactory(shell, 'public')
await publicFiles.mountStaticHttpServer('/public')
// FIXME: REMOVE_ME ^^
