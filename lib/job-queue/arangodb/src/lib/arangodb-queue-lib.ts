import { date_time_string, unreachable_never } from '@moodle/lib-types'
import { aql } from 'arangojs'
import {
  arangoDbJob,
  arangoDbJobDocument,
  consumptionResult,
  executeJob,
  executionOutcome,
  jobCollection,
  jobConfig,
  jobStatus,
} from './types'

export async function createJobCollection<jobData>({ jobCollection }: { jobCollection: jobCollection<jobData> }) {
  await jobCollection.create({ cacheEnabled: true })
  //await jobCollection.ensureIndex({ type: 'persistent', fields: ['xxx.yyy'] })
}

export function getLastExecutionOutcome({ executionOutcomes }: Pick<arangoDbJob<unknown>, 'executionOutcomes'>) {
  return executionOutcomes[0]
}

export async function enqueueJob<jobData>({
  jobName,
  jobData,
  enqueueDate,
  jobCollection,
  id,
}: {
  jobName: string
  jobData: jobData
  enqueueDate: date_time_string
  jobCollection: jobCollection<jobData>
  id?: string | undefined
}) {
  const jobDoc = await jobCollection.save(
    {
      _key: id ?? undefined,
      name: jobName,
      status: 'enqueued',
      enqueueDate,
      retryOnDate: enqueueDate,
      executionOutcomes: [],
      lastEngagedDate: null,
      jobData,
    },
    { returnNew: true },
  )
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return jobDoc.new!
}

export async function consumeJob<jobData>({
  jobDoc,
  jobCollection,
  executeJob,
  jobConfig: { progressTimeoutSecs },
}: {
  executeJob: executeJob<jobData>
  jobDoc: arangoDbJobDocument<jobData>
  jobCollection: jobCollection<jobData>
  jobConfig: Pick<jobConfig, 'progressTimeoutSecs'>
}) {
  const executionOutcome = await Promise.race([
    executeJob({ job: jobDoc }).catch<executionOutcome>(
      error =>
        ({
          date: date_time_string('now'),
          result: 'failed',
          reason: 'unhandledError',
          error,
        }) satisfies executionOutcome,
    ),
    new Promise<executionOutcome>((_resolve, reject) =>
      setTimeout(
        () =>
          reject({
            result: 'failed',
            reason: 'timeout',
            timeoutSecs: progressTimeoutSecs,
            date: date_time_string('now'),
          } satisfies executionOutcome),
        progressTimeoutSecs * 1000,
      ),
    ),
  ])

  const newJobDoc = await upsertJobDocument({
    jobDoc,
    executionOutcome,
    jobCollection,
  })

  const consumptionResult: consumptionResult<jobData> = { newJobDoc, executionOutcome }
  return consumptionResult
}

export async function fetchAndEngageSomeEnqueuedJobs<jobData>({
  parallelism,
  jobName,
  jobCollection,
  amount,
}: {
  jobName: string
  parallelism: number
  amount: number
  jobCollection: jobCollection<jobData>
}) {
  const now = date_time_string('now')
  const cursor = await jobCollection.database.query(aql<arangoDbJobDocument<jobData>>`
                FOR job IN ${jobCollection}

                  FILTER job.name == ${jobName}
                      && (
                            job.status == 'enqueued'
                        ||  job.status == 'inProgress'
                        )

                  SORT  job.status DESC, // DESC: "inProgress" first, to cut them out later with LIMIT+FILTER
                        job.retryOnDate,
                        job.enqueueDate,
                        job.lastEngagedDate

                  LIMIT ${parallelism}

                  FILTER  job.status == 'enqueued'

                  LIMIT ${amount}

                  UPDATE job WITH {
                    status: 'inProgress',
                    lastEngagedDate: ${now}
                  } IN ${jobCollection}

                RETURN NEW
            `)

  return cursor.all()
}

export async function restoreTimedoutJobs<jobData>({
  jobName,
  jobCollection,
  timeoutSecs,
}: {
  jobName: string
  timeoutSecs: number
  jobCollection: jobCollection<jobData>
}) {
  const now = date_time_string('now')
  const timeoutOutcome: executionOutcome = {
    date: now,
    result: 'failed',
    reason: 'timeout',
    timeoutSecs,
  }
  const cursor = await jobCollection.database.query(aql<arangoDbJobDocument<jobData>>`
                FOR job IN ${jobCollection}

                  FILTER job.name == ${jobName}
                      && job.status == 'inProgress'
                      && DATE_ADD(job.lastEngagedDate, ${timeoutSecs}, 's') > ${now}

                  UPDATE job WITH {
                    status: 'enqueued',
                    executionOutcomes: PUSH( job.executionOutcomes, ${timeoutOutcome} ),
                  } IN ${jobCollection}

                RETURN NEW
            `)

  return cursor.all()
}

export async function upsertJobDocument<jobData>({
  jobDoc,
  executionOutcome,
  jobCollection,
}: {
  jobDoc: arangoDbJobDocument<jobData>
  executionOutcome: executionOutcome
  jobCollection: jobCollection<jobData>
}) {
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
      ? executionOutcome.followUp.onDate
      : jobDoc.retryOnDate

  const updatedJob: arangoDbJobDocument<jobData> = {
    ...jobDoc,
    status: newJobStatus,
    retryOnDate: newRetryOnDate,
    executionOutcomes: [...jobDoc.executionOutcomes, executionOutcome],
  }

  const cursor = await jobCollection.database.query<arangoDbJobDocument<jobData>>(aql`
      UPSERT { _key: ${jobDoc._key} }

      INSERT ${updatedJob}
      REPLACE ${updatedJob}

      IN ${jobCollection}

      RETURN NEW
  `)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (await cursor.all())[0]!
}
