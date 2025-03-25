import { dbStruct } from '../../../db-structure'
import { dbUpgradeData } from '../../types'
import { createDatabases } from './0.createDatabases'
import { createCollections } from './1.createCollections'
// import { removePropOnInsert } from '../lib/id'

export const VERSION = 'v0_1'
export async function upgrade({ dbStruct }: { dbStruct: dbStruct }) {
  await createDatabases({ dbStruct })
  await createCollections({ dbStruct })

  // bump_version
  const upgradeDoc: dbUpgradeData = {
    previous: '_',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'initialization',
  }

  return upgradeDoc
}
