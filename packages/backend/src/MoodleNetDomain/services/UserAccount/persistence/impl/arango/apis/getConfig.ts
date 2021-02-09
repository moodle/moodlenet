import { aql } from 'arangojs'
import { Maybe } from '../../../../../../../lib/helpers/types'
import { DefaultConfig } from '../../../../assets/defaultConfig'
import { Config, UserAccountPersistence } from '../../../types'
import { DBReady } from '../UserAccount.persistence.arango.env'
export const getConfig: UserAccountPersistence['getConfig'] = async () => {
  const { db, Config } = await DBReady
  const cursor = await db.query(aql`
    FOR cfg IN Config
    SORT cfg.createdAt DESC
    LIMIT 1
    RETURN cfg
  `)
  const currentConfig: Maybe<Config> = await cursor.next()
  if (currentConfig) {
    return currentConfig
  } else {
    const savedDefaultConfig = await Config.save(DefaultConfig, {
      returnNew: true,
    })
    const config = savedDefaultConfig.new
    if (!config) {
      throw new Error(`couldn't save default config`)
    }
    return config
  }
}
