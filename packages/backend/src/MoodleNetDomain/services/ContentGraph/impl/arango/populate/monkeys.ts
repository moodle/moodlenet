import { contentGraphDef } from '@moodlenet/common/lib/content-graph/def'
import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { Database } from 'arangojs'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { newFlow } from '../../../../../../lib/domain/flow'
import { MoodleNetExecutionContext } from '../../../../../types'
import { EdgeType, NodeType } from '../../../ContentGraph.graphql.gen'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { getPersistence } from '../persistence'
import { cfg, databaseName, MONKEYS_WAIT, PARALLEL_MONKEYS } from './env'
import * as fakeEdge from './fake/edge'
import * as fakeNode from './fake/node'

getPersistence({ cfg, databaseName }).then(async ([{ db }]) => {
  for (let i = 0; i < PARALLEL_MONKEYS; i++) {
    monkeyRun()
  }

  async function monkeyRun() {
    const ctx = await makeCtx(db)
    getRndAction(db)(ctx)
      .then(
        res => console.log(res),
        (err: any) => console.error(`- ERR: `, err),
      )
      .finally(() => {
        console.log(`For profileId: ${ctx.profileId}\n`)
        setTimeout(monkeyRun, MONKEYS_WAIT)
      })
  }
})
const monkeyCreateNode = (_db: Database) => async (ctx: MoodleNetExecutionContext<'session'>) => {
  const nodeType = getRndType('Profile', 'Subject')
  return enqueue<MoodleNetArangoContentGraphSubDomain>()(
    'ContentGraph.Node.Create',
    newFlow(),
  )({ ctx, data: fakeNode[nodeType](), nodeType }).then(() => `NODE: [${nodeType}]`)
}

const monkeyCreateEdge = (db: Database) => async (ctx: MoodleNetExecutionContext<'session'>) => {
  const edgeType = getRndType('Created')
  const conn = getRndConnection(edgeType)
  const [from, to] = await Promise.all([
    ['Follows', 'Likes'].includes(edgeType) ? ctx.profileId : getRndId(db, conn.from),
    getRndId(db, conn.to),
  ])
  const info = `${conn.from}:${from} -> ${edgeType} -> ${conn.to}:${to}`
  if (!(from && to)) {
    return `didn't find both nodes for ${info}`
  }
  return enqueue<MoodleNetArangoContentGraphSubDomain>()(
    'ContentGraph.Edge.Create',
    newFlow(),
  )({ ctx, data: fakeEdge[edgeType](), edgeType, from, to }).then(() => `EDGE: ${info}`)
}

const actions = [monkeyCreateEdge, monkeyCreateNode]
const getRndAction = (db: Database) => actions[Math.round(Math.max(Math.random() - 0.1618, 0))]!(db)
const getRndType = <T extends NodeType | EdgeType>(t: T, ...ts: T[]) => [t, ...ts].sort(() => Math.random() - 0.5)[0]!

const getRndId = async (db: Database, t: NodeType | EdgeType): Promise<Id | null> => {
  const c = await db.query(`FOR v IN ${t} SORT RAND() LIMIT ${Math.floor(Math.random() * 10)},1 RETURN v.id`)
  const id = await c.next()
  c.kill()
  return id
}

const getRndConnection = (edgeType: EdgeType) => ({
  from: contentGraphDef.edges[edgeType][0].sort(() => Math.random() - 0.5)[0]!,
  to: contentGraphDef.edges[edgeType][1].sort(() => Math.random() - 0.5)[0]!,
})

const makeCtx = async (db: Database): Promise<MoodleNetExecutionContext<'session'>> => {
  const profileId = (await getRndId(db, 'Profile'))! // profile must be
  const monkeyTag = `monkeyFor[${profileId}]`
  return {
    type: 'session',
    profileId,
    role: 'User',
    flow: newFlow(['monkey-populate']),
    username: monkeyTag,
    email: monkeyTag,
    userId: monkeyTag,
  }
}
