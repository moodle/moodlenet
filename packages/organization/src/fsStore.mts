import fileStoreFactory from '@moodlenet/simple-file-store'
import shell from './shell.mjs'

// FIXME: REMOVE_ME
export const publicFiles = await fileStoreFactory(shell, 'public')
