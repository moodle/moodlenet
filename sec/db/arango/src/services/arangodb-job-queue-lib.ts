import '@moodle/domain'
import {
  enqueueJob,
  fetchAndEngageSomeEnqueuedJobs,
  job,
  jobStatus,
  queueServiceWorkers,
  reEnqueueTimedoutInProgressJobs,
  updateJob,
} from '@moodle/lib-job-queue-service'
import { any_, unreachable_never } from '@moodle/lib-types'
import { aql } from 'arangojs'
import { literal } from 'arangojs/aql'
import { DocumentCollection } from 'arangojs/collection'
import assert from 'assert'
import { dbStruct } from '../db-structure'
export type jobCollection<jobData> = DocumentCollection<Omit<job<jobData>, 'id'>>

export function provideArangoQueueServiceWorkers({ dbStruct }: { dbStruct: dbStruct }): queueServiceWorkers<{ envelope: moo.def.model.envelope<any_> }> {
  const jobCollection = dbStruct.services.coll.modelEnvelopeQueue
  return {
    enqueueJob: arangoEnqueueJob({ jobCollection }),
    updateJob: updateJob({ jobCollection }),
    reEnqueueTimedoutInProgressJobs: arangoReEnqueueTimedoutInProgressJobs({ jobCollection }),
    fetchAndEngageSomeEnqueuedJobs: arangoFetchAndEngageSomeEnqueuedJobs({ jobCollection }),
  }
}

export function arangoEnqueueJob<jobData>({
  jobCollection,
}: {
  jobCollection: jobCollection<jobData>
}): enqueueJob<jobData> {
  return async function ({ job }) {
    const cursor = await jobCollection.database.query<job<jobData>>(aql`
      LET job = ${job}
      INSERT ${aql_job2doc('job')}
      IN ${jobCollection}
      RETURN ${aql_doc2job('NEW')}
  `)

    const newJob = (await cursor.all())[0]
    assert(newJob, 'could not create job')
  }
}

export function arangoFetchAndEngageSomeEnqueuedJobs<jobData>({
  jobCollection,
}: {
  jobCollection: jobCollection<jobData>
}): fetchAndEngageSomeEnqueuedJobs<jobData> {
  return async function ({ jobName, amount, engageDate }) {
    const cursor = await jobCollection.database.query(aql<job<jobData>>`
                FOR job IN ${jobCollection}

                  FILTER job.name == ${jobName}
                      && (
                            job.status == 'enqueued'
                        // ||  job.status == 'inProgress'
                        )

                  SORT  // job.status DESC, // DESC: "inProgress" first, to cut them out later with LIMIT+FILTER
                        job.retryOnDate,
                        job.enqueueDate,
                        job.lastEngagedDate

                  // LIMIT $??{parallelism}

                  // FILTER  job.status == 'enqueued'

                  LIMIT ${amount}

                  UPDATE job WITH {
                    status: 'inProgress',
                    lastEngagedDate: ${engageDate}
                  } IN ${jobCollection}

                RETURN ${aql_doc2job('NEW')}
            `)

    return cursor.all()
  }
}

export function arangoReEnqueueTimedoutInProgressJobs<jobData>({
  jobCollection,
}: {
  jobCollection: jobCollection<jobData>
}): reEnqueueTimedoutInProgressJobs<jobData> {
  return async function ({ jobName, lastEngagedDateBefore, timeoutOutcome }) {
    const cursor = await jobCollection.database.query(aql<job<jobData>>`
        FOR job IN ${jobCollection}

          FILTER job.name == ${jobName}
              && job.status == 'inProgress'
              && job.lastEngagedDate < ${lastEngagedDateBefore}

          UPDATE job WITH {
            status: 'enqueued',
            executionOutcomes: PUSH( job.executionOutcomes, ${timeoutOutcome} ),
          } IN ${jobCollection}

        RETURN ${aql_doc2job('NEW')}
    `)
    return cursor.all()
  }
}

export function updateJob<jobData>({ jobCollection }: { jobCollection: jobCollection<jobData> }): updateJob<jobData> {
  return async function ({ job, executionOutcome }) {
    const newJobStatus: jobStatus =
      executionOutcome.result === 'done'
        ? 'done'
        : executionOutcome.result === 'failed'
          ? executionOutcome.reason === 'applicative'
            ? executionOutcome.followUp.action === 'abort'
              ? 'aborted'
              : executionOutcome.followUp.action === 'retry'
                ? 'enqueued'
                : unreachable_never(
                    executionOutcome.followUp,
                    `unexpected executionOutcome.followUp.action ${JSON.stringify({ executionOutcome })}`,
                  )
            : 'enqueued'
          : unreachable_never(executionOutcome, `unexpected executionOutcome.result ${JSON.stringify({ executionOutcome })}`)

    const newRetryOnDate =
      executionOutcome.result === 'failed' &&
      executionOutcome.reason === 'applicative' &&
      executionOutcome.followUp.action === 'retry'
        ? executionOutcome.followUp.fromDate
        : job.retryOnDate

    const updatedJob: job<jobData> = {
      ...job,
      status: newJobStatus,
      retryOnDate: newRetryOnDate,
      executionOutcomes: [...job.executionOutcomes, executionOutcome],
    }

    const cursor = await jobCollection.database.query<job<jobData>>(aql`
      LET updatedJob = ${updatedJob}
      REPLACE { _key: updatedJob.id }
      WITH ${aql_job2doc('updatedJob')}
      IN ${jobCollection}

      RETURN ${aql_doc2job('NEW')}
  `)

    const found = (await cursor.all())[0]
    return found ?? null
  }
}

function aql_doc2job(docAqlVar: string) {
  return literal(`( MERGE({}, UNSET(${docAqlVar}, ['_key', '_id', '_rev']), { id: ${docAqlVar}._key } ) )`)
}
function aql_job2doc(jobAqlVar: string) {
  return literal(`( MERGE({}, UNSET(${jobAqlVar}, ['id']), { _key: ${jobAqlVar}.id } ) )`)
}
