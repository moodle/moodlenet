import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { engagingResourceDraftIngestionRecord } from '@moodle/module/resource-ingestion'
import { aql } from 'arangojs'
import { dbStruct } from '../db-structure'

export function resource_ingestion_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return (/* secondaryCtx */) => {
    const secondaryAdapter: secondaryAdapter = {
      resourceIngestion: {
        query: {
          async engageEnqueuedDraftResourcesIngestion({ maxOngoingAmount }) {
            const cursor = await dbStruct.appData.db.query(aql<engagingResourceDraftIngestionRecord>`

                FOR resourceDraftIngestion IN ${dbStruct.appData.coll.resourceDraftIngestion}

                  FILTER  resourceDraftIngestion.current.status == 'enqueued'
                        || resourceDraftIngestion.current.status == 'ongoing'

                  SORT  resourceDraftIngestion.current.status DESC,
                        resourceDraftIngestion.current.status.enqueueDate

                  LIMIT ${maxOngoingAmount}

                  FILTER  resourceDraftIngestion.current.status == 'enqueued'

                  UPDATE resourceDraftIngestion WITH {
                    current: {
                      status: 'ongoing'
                    }
                  } IN ${dbStruct.appData.coll.resourceDraftIngestion}

                  LIMIT ${maxOngoingAmount}

                RETURN MOODLE::RESTORE_RECORD_ID(resourceDraftIngestion)
            `)
            return cursor.all()
          },
        },
      },
    }
    return secondaryAdapter
  }
}
