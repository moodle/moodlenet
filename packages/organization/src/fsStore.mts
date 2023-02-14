import makeSimpleFileStore from '@moodlenet/simple-file-store'
import shell from './shell.mjs'

// FIXME: REMOVE_ME
export const publicFiles = await makeSimpleFileStore(shell, 'public')
