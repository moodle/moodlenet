import makeSimpleFileStore from '@moodlenet/simple-file-store'
import shell from './shell.mjs'

export const publicFiles = await makeSimpleFileStore(shell, 'public')
