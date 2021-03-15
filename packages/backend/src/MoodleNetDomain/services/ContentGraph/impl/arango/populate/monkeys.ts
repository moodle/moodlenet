import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { Database } from 'arangojs'
import { MoodleNetExecutionContext, Role } from '../../../../../types'
import { EdgeType, NodeType } from '../../../ContentGraph.graphql.gen'
import { contentGraph } from '../../../graphDefinition'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { getPersistence } from '../persistence'
import { cfg, databaseName, MONKEYS_WAIT, PARALLEL_MONKEYS } from './env'
import { call } from '../../../../../../lib/domain/amqp/call'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { newFlow } from '../../../../../../lib/domain/flow'
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
        console.log(`For userId:${ctx.userId}\n`)
        setTimeout(monkeyRun, MONKEYS_WAIT)
      })
  }
})
const monkeyCreateNode = (_db: Database) => async (ctx: MoodleNetExecutionContext<'session'>) => {
  const nodeType = getRndType(NodeType, 'User', 'Subject')
  return enqueue<MoodleNetArangoContentGraphSubDomain>()(
    'ContentGraph.Node.Create',
    newFlow(),
  )({ ctx, data: fakeNode[nodeType](), nodeType }).then(() => `NODE: [${nodeType}]`)
}

const monkeyCreateEdge = (db: Database) => async (ctx: MoodleNetExecutionContext<'session'>) => {
  const edgeType = getRndType(EdgeType, 'Created')
  const conn = getRndConnection(edgeType)
  const [from, to] = await Promise.all([
    [EdgeType.Follows, EdgeType.Likes, EdgeType].includes(edgeType) ? ctx.userId : getRndId(db, conn.from),
    getRndId(db, conn.to),
  ])
  const info = `${conn.from}:${from} -> ${edgeType} -> ${conn.to}:${to}`
  if (!(from && to)) {
    return `didn't find both nodes for ${info}`
  }
  return call<MoodleNetArangoContentGraphSubDomain>()(
    'ContentGraph.Edge.Create',
    newFlow(),
  )({ ctx, data: fakeEdge[edgeType](), edgeType, from, to }).then(() => `EDGE: ${info}`)
}

const actions = [monkeyCreateEdge, monkeyCreateNode]
const getRndAction = (db: Database) => actions[Math.round(Math.max(Math.random() - 0.3, 0))](db)
const getRndType = <T extends object>(_: T, ...x: (keyof T)[]) =>
  _[
    Object.keys(_)
      .filter(_ => !x.includes(_ as keyof T))
      .sort(() => Math.random() - 0.5)[0] as keyof T
  ]
const getRndId = async (db: Database, t: NodeType | EdgeType): Promise<Id | null> => {
  const c = await db.query(`FOR v IN ${t} SORT RAND() LIMIT ${Math.floor(Math.random() * 10)},1 RETURN v._id`)
  const id = await c.next()
  c.kill()
  return id
}

const getRndConnection = (edgeType: EdgeType) => contentGraph[edgeType].connections.sort(() => Math.random() - 0.5)[0]

const makeCtx = async (db: Database): Promise<MoodleNetExecutionContext<'session'>> => {
  const userId = (await getRndId(db, NodeType.User))! // user must be
  const monkeyTag = `monkeyFor[${userId}]`
  return {
    type: 'session',
    userId,
    role: Role.User,
    flow: newFlow(['monkey-populate']),
    username: monkeyTag,
    email: monkeyTag,
    accountId: monkeyTag,
  }
}
