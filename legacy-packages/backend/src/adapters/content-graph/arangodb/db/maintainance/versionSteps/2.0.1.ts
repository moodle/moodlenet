import { CollectionType } from 'arangojs'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { justExecute } from '../../../../../../lib/helpers/arango/query'

const init_2_0_1: VersionUpdater = {
  async pullUp({ db }) {
    const collectionsInfo = (await db.listCollections()).filter(
      _ => _.type === CollectionType.DOCUMENT_COLLECTION && _.name !== 'DB_MIGRATIONS',
    )
    await Promise.all(
      collectionsInfo.map(async ({ name }) => {
        console.log(`updating collection ${name} _creator`)
        const creatorColl = ['Collection', 'Resource'].includes(name) ? 'Profile' : 'Organization'
        const q = `
          FOR node in ${name}
            let creatorAuthNode = (FOR c in ${creatorColl} FILTER MATCHES(c, node._creator) LIMIT 1 RETURN c)[0]
            let creatorAuthPermId = creatorAuthNode._key
            UPDATE node WITH {
              _creator:{ _permId: creatorAuthPermId }
            } IN ${name} 
          RETURN NEW
        `
        await justExecute(q, db)
      }),
    )
  },
  pushDown() {
    throw new Error('not implemented')
  },
}

module.exports = init_2_0_1
