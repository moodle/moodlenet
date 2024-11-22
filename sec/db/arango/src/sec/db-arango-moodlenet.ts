import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { moodlenetContributorRecord } from '@moodle/module/moodlenet'
import { aql } from 'arangojs'
import { dbStruct } from '../db-structure'
import { save_id_to_key } from '../lib/key-id-mapping'
import { getMoodlenetContributor, updateMoodlenetContributor } from './moodlenet-db'
import { Collection, DocumentCollection } from 'arangojs/collection'
import { eduBloomCognitiveRecord, eduIscedFieldRecord, eduIscedLevelRecord, eduResourceTypeRecord } from '@moodle/module/edu'
import { contentLanguageRecord, contentLicenseRecord } from '@moodle/module/content'

export function moodlenet_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      moodlenet: {
        query: {
          async contributor({ select, noAccessLevelFilter }) {
            const moodlenetContributorRecord = await getMoodlenetContributor({ dbStruct, select })

            return moodlenetContributorRecord && (noAccessLevelFilter || moodlenetContributorRecord.access === 'public')
              ? [true, { moodlenetContributorRecord }]
              : [false, { reason: 'notFound' }]
          },
          async enabledCategories() {
            const [bloomCognitives, iscedFields, iscedLevels, resourceTypes, languages, licenses] = await Promise.all([
              dbStruct.moodlenet.db
                .query<eduBloomCognitiveRecord>(
                  aql`FOR doc IN ${dbStruct.moodlenet.coll.eduBloomCognitive} RETURN MOODLE::RESTORE_RECORD_ID(doc)`,
                )
                .then(cursor => cursor.all()),
              dbStruct.moodlenet.db
                .query<eduIscedFieldRecord>(
                  aql`FOR doc IN ${dbStruct.moodlenet.coll.eduIscedField} FILTER doc.enabled==true RETURN MOODLE::RESTORE_RECORD_ID(doc)`,
                )
                .then(cursor => cursor.all()),
              dbStruct.moodlenet.db
                .query<eduIscedLevelRecord>(
                  aql`FOR doc IN ${dbStruct.moodlenet.coll.eduIscedLevel} FILTER doc.enabled==true RETURN MOODLE::RESTORE_RECORD_ID(doc)`,
                )
                .then(cursor => cursor.all()),
              dbStruct.moodlenet.db
                .query<eduResourceTypeRecord>(
                  aql`FOR doc IN ${dbStruct.moodlenet.coll.eduResourceType} FILTER doc.enabled==true RETURN MOODLE::RESTORE_RECORD_ID(doc)`,
                )
                .then(cursor => cursor.all()),
              dbStruct.moodlenet.db
                .query<contentLanguageRecord>(
                  aql`FOR doc IN ${dbStruct.moodlenet.coll.contentLanguage} FILTER doc.enabled==true RETURN MOODLE::RESTORE_RECORD_ID(doc)`,
                )
                .then(cursor => cursor.all()),
              dbStruct.moodlenet.db
                .query<contentLicenseRecord>(
                  aql`FOR doc IN ${dbStruct.moodlenet.coll.contentLicense} FILTER doc.enabled==true RETURN MOODLE::RESTORE_RECORD_ID(doc)`,
                )
                .then(cursor => cursor.all()),
            ] as const)
            return {
              enabledCategories: {
                bloomCognitives,
                iscedFields,
                iscedLevels,
                resourceTypes,
                languages,
                licenses,
              },
            }
          },
          async contributors({ range: [limit, skip = 0], sort = [] }) {
            const [sortBy, sortDir = 'ASC'] = sort
            const sortByMap: Record<(typeof sort)[0] & string, string> = {
              points: 'moodlenetContributorDoc.stats.points',
            }
            const aqlSort = !sortBy ? '' : aql`SORT ${sortByMap[sortBy]} ${sortDir}`
            const cursor = await dbStruct.moodlenet.db.query(aql<moodlenetContributorRecord>`
                FOR moodlenetContributorDoc IN ${dbStruct.moodlenet.coll.contributor}
                FILTER moodlenetContributorDoc.access == 'public'
                ${aqlSort}
                LIMIT ${skip},${limit}
                return MOODLE::RESTORE_RECORD_ID(moodlenetContributorDoc)
              `)
            const moodlenetContributorRecords = await cursor.all()
            return { moodlenetContributorRecords }
          },
        },
        write: {
          async createMoodlenetContributor({ moodlenetContributorRecord }) {
            dbStruct.moodlenet.coll.contributor.save(save_id_to_key('id')(moodlenetContributorRecord)).catch(() => null)
            return
          },
          async updatePartialMoodlenetContributor({ partialMoodlenetContributorRecord, select }) {
            await updateMoodlenetContributor({
              dbStruct,
              select,
              partialMoodlenetContributorRecord,
            })
          },
        },
        // service: secondaryCtx.mod.secondary.env.service,
        // queue: secondaryCtx.mod.secondary.env.queue,
        // write: secondaryCtx.mod.secondary.env.write,
        // sync: secondaryCtx.mod.env
      },
    }
    return secondaryAdapter
  }
}
