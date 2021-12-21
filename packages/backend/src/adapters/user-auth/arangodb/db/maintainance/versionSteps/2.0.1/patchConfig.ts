import { DefaultConfigPatch } from '@moodlenet/common/dist/content-graph/defaultUserAuthConfigPatch'
import { Database } from 'arangojs'
import { aqlstr, getOneResult } from '../../../../../../../lib/helpers/arango/query'
import { getLatestConfigQ } from '../../../../queries/config'
import { CONFIG } from '../../../../types'

export const patchConfig = async ({ db }: { db: Database }) => {
  const SETUP_2_0_1_NEW_USER_PUBLISHED = process.env.SETUP_2_0_1_NEW_USER_PUBLISHED || ''
  if (!['true', 'false'].includes(SETUP_2_0_1_NEW_USER_PUBLISHED)) {
    throw new Error(`patchConfig: need env var SETUP_2_0_1_NEW_USER_PUBLISHED set to either "true" or "false"`)
  }
  const SETUP_NEW_USER_PUBLISHED = SETUP_2_0_1_NEW_USER_PUBLISHED === 'true'
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
        UPDATE cfg WITH ${aqlstr({
          newUserPublished: SETUP_NEW_USER_PUBLISHED,
          ...DefaultConfigPatch,
        })} in ${CONFIG}
      RETURN NEW
    `,
    db,
  )
  if (!updateRes) {
    throw new Error(`no UserAuthConfig found`)
  }
}
