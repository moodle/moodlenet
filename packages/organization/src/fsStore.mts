import makeSimpleFileStore from '@moodlenet/simple-file-store'
import shell from './shell.mjs'

export default await makeSimpleFileStore(shell)
