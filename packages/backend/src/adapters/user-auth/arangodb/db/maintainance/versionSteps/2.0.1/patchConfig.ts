import { DefaultConfigPatch } from '@moodlenet/common/dist/content-graph/defaultUserAuthConfigPatch'
import { Database } from 'arangojs'
import { aqlstr, getOneResult } from '../../../../../../../lib/helpers/arango/query'
import { getLatestConfigQ } from '../../../../queries/config'
import { CONFIG } from '../../../../types'

export const patchConfig = async ({ db }: { db: Database }) => {
  console.log(`Patching config ...`)
  const config = await getOneResult(getLatestConfigQ(), db)
  if (!config) {
    throw new Error(`no UserAuthConfig found`)
  }

  const updateRes = await getOneResult(
    `
      FOR cfg IN ${CONFIG}
        SORT cfg._key desc
        LIMIT 1
        UPDATE cfg WITH ${aqlstr(DefaultConfigPatch)} in ${CONFIG}
      RETURN NEW
    `,
    db,
  )
  if (!updateRes) {
    throw new Error(`no UserAuthConfig found`)
  }
}
