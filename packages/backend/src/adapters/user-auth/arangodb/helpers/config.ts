import { Database } from 'arangojs'
import { getOneResult } from '../../../../lib/helpers/arango'
import { getLatestConfigQ } from '../queries/getConfig'
import { UserAuthConfig } from '../types'

export const getLatestConfig = async ({ db }: { db: Database }) => {
  const q = getLatestConfigQ()
  const cfg = await getOneResult(q, db)
  return cfg as UserAuthConfig
}
