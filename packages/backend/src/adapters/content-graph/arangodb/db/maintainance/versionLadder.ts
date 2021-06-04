import { VersionLadder } from '../../../../../lib/helpers/arango/migrate/types'

const versionLadder: VersionLadder = {
  '0.0.1': {
    async initialSetUp() {
      console.log('done initialSetUp 0.0.1')
    },
  },
  '0.0.2': {
    async pullUp() {
      console.log('done pullUp to 0.0.2')
    },
    async pushDown() {
      console.log('done pushDown to 0.0.1')
    },
  },
}

module.exports = versionLadder
