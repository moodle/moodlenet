import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { aql } from 'arangojs'
import { ProfileInfo } from 'domain/src/user-hone'
import { db_struct } from '../db-structure'
import { getModConfigs, updateDeepPartialModConfigs } from '../lib/modules'
import { user_home_record2userHomeDocument } from './db-arango-user-home-lib/mappings'

export function user_home_moodle_secondary_factory({
  db_struct,
}: {
  db_struct: db_struct
}): moodle_secondary_factory {
  return ctx => {
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        userHome: {
          db: {
            async getConfigs() {
              const configs = await getModConfigs({
                moduleName: ctx.invoked_by.module,
                db_struct,
              })
              return configs
            },
            async updatePartialConfigs({ partialConfigs }) {
              const result = await updateDeepPartialModConfigs({
                moduleName: ctx.invoked_by.module,
                db_struct,
                partialConfigs,
              })
              return [!!result, _void]
            },
            async updatePartialProfileInfo({ partialProfileInfo, userId }) {
              const updateCursor = await db_struct.data.db.query<ProfileInfo>(aql`
                FOR userHome IN ${db_struct.data.coll.userHome}
                FILTER userHome.userId == ${userId}
                LIMIT 1
                UPDATE userHome WITH { profileInfo: ${partialProfileInfo} } IN ${db_struct.data.coll.userHome}
                RETURN NEW.profileInfo
                `)
              const [newProfileInfo] = await updateCursor.all()
              return [!!newProfileInfo, _void]
            },
            async createUserHome({ userHome }) {
              const result = await db_struct.data.coll.userHome
                .save(user_home_record2userHomeDocument(userHome))
                .catch(() => null)

              return [!!result, _void]
            },
          },
        },
      },
    }
    return moodle_secondary_adapter
  }
}
