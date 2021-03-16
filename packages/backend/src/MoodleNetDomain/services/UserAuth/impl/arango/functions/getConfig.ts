import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { DefaultConfig } from '../../../assets/defaultConfig'
import { Persistence, UserAuthConfig } from '../types'
export const getConfig = async ({ persistence: { db, Config } }: { persistence: Persistence }) => {
  const cursor = await db.query(aql`
    FOR cfg IN ${Config}
    SORT cfg.createdAt DESC
    LIMIT 1
    RETURN cfg
  `)
  const currentConfig: Maybe<UserAuthConfig> = await cursor.next()
  if (currentConfig) {
    return currentConfig
  }

  const savedDefaultConfig = await Config.save(DefaultConfig, {
    returnNew: true,
  })
  const config = savedDefaultConfig.new
  if (!config) {
    throw new Error(`couldn't save default config`)
  }
  return config
}
