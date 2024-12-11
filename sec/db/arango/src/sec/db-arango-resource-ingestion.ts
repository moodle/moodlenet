import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { engagingResourceDraftIngestionRecord } from '@moodle/module/resource-ingestion'
import { aql } from 'arangojs'
import { dbStruct } from '../db-structure'

export function resource_ingestion_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return (/* secondaryCtx */) => {
    const secondaryAdapter: secondaryAdapter = {
      resourceIngestion: {
        query: {
          async engageEnqueuedDraftResourcesIngestion({ parallelilsm }) {
            const cursor = await dbStruct.appData.db.query(aql<engagingResourceDraftIngestionRecord>`

                FOR eduResourceDraftIngestionDoc IN ${dbStruct.appData.coll.eduResourceDraftIngestion}

                  FILTER  eduResourceDraftIngestionDoc.current.status == 'enqueued'
                        || eduResourceDraftIngestionDoc.current.status == 'ongoing'

                  SORT  eduResourceDraftIngestionDoc.current.status DESC,
                        eduResourceDraftIngestionDoc.current.status.enqueueDate

                  LIMIT ${parallelilsm}

                  FILTER  eduResourceDraftIngestionDoc.current.status == 'enqueued'

                  UPDATE eduResourceDraftIngestionDoc WITH {
                    current: {
                      status: 'ongoing'
                    }
                  } IN ${dbStruct.appData.coll.eduResourceDraftIngestion}

                RETURN MOODLE::RESTORE_RECORD_ID(eduResourceDraftIngestionDoc)
            `)
            return cursor.all()
          },
        },
      },
    }
    return secondaryAdapter
  }
}
