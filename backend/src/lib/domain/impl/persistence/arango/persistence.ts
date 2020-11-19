import { aql } from 'arangojs'
import { DomainPersistence } from '../../../types'
import { collections as coll, log } from './'
import { db } from './domain.arango.env'

const enqueueWF: DomainPersistence['enqueueWF'] = async (enqueueParams) => {
  log(`enqueueWF ${enqueueParams.id}`, 0)
  const now = new Date()
  const enqueueState = {
    ...enqueueParams,
    status: 'enqueued',
    started: now,
    updated: now,
  } as const
  return (
    await Promise.all([
      coll.WFLog.save({ ...enqueueParams, at: now }),
      coll.WFActive.save(enqueueState),
    ])
  )[1]
}

const progressWF: DomainPersistence['progressWF'] = async ({ id, progress /* ctx */ }) => {
  log(`progressWF ${id}`, 0)
  log(progress, 0)
  const now = new Date()
  await Promise.all([
    coll.WFLog.save({ ...progress, at: now }),
    db.query(aql`
      FOR wf IN WFActive
        FILTER wf.id == ${id}
        LIMIT 1
        UPDATE wf WITH { status:'progress', updated:${now} progress:${progress} } IN WFActive
    `),
  ])
}

const endWF: DomainPersistence['endWF'] = async ({ endProgress, id /* ctx */ }) => {
  log(`endWF ${id}`, 0)
  log(endProgress, 0)
  const now = new Date()
  await Promise.all([
    coll.WFLog.save({ ...endProgress, at: now }),
    db.query(aql`
      FOR wf IN WFActive
        FILTER wf.id == ${id}
        LIMIT 1
        UPDATE wf WITH { status:'end', updated:${now} progress:${endProgress} } IN WFActive
    `),
  ])
}

const getWFState: DomainPersistence['getWFState'] = async ({ id }) => {
  const curs = await db.query(aql`
    FOR wf IN WFActive
      FILTER wf.id == ${id}
      LIMIT 1
      RETURE wf
  `)
  return curs.next()
}

const arangoPersistence: DomainPersistence = {
  endWF,
  enqueueWF,
  getWFState,
  progressWF,
}
module.exports = arangoPersistence
