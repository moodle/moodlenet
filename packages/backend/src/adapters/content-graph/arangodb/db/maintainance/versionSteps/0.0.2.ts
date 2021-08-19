import { ArangoError } from 'arangojs/error'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { createLikeEdgeCollections } from './0.0.2/createLikeEdgeCollections'

const v_0_0_2: VersionUpdater<MNStaticEnv> = {
  async pullUp({ db /* , ctx: { domain } */ }) {
    try {
      await createLikeEdgeCollections({ db })
    } catch (e) {
      if (e instanceof ArangoError) {
        console.error({
          code: e.code,
          errorNum: e.errorNum,
          message: e.message,
          // response: e.response,
          name: e.name,
        })
      }
      console.error(`push 0_0_2 : ${e instanceof Error ? e.stack : e}`)
      throw e
    }
  },
  async pushDown() {
    throw new Error(`v_0_0_2 pushDown not implemented`)
  },
}

module.exports = v_0_0_2
