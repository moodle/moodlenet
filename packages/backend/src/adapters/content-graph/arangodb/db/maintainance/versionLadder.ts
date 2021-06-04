import { VersionLadder } from '../../../../../lib/helpers/arango/migrate/types'

export const versionLadder: VersionLadder = {
  '0.0.1': {
    async initialSetUp() {
      console.log('done initialSetUp 0.0.1')
    },
  },
}
