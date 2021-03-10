import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { call } from '../../../../../../lib/domain/amqp/call'
import { newFlow } from '../../../../../../lib/domain/flow'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { MoodleNetExecutionContext, Role } from '../../../../../types'
import { EdgeType, NodeType } from '../../../ContentGraph.graphql.gen'
import { contentGraph } from '../../../graphDefinition'
import { getDB } from '../ContentGraph.persistence.arango.env'
import { MONKEYS_WAIT, PARALLEL_MONKEYS } from './env'
import * as fakeEdge from './fake/edge'
import * as fakeNode from './fake/node'

getDB().then(async db => {
  const getId = async (t: NodeType | EdgeType): Promise<Id | null> => {
    const c = await db.query(`FOR v IN ${t} SORT RAND() LIMIT ${Math.floor(Math.random() * 10)},1 RETURN v._id`)
    const id = await c.next()
    c.kill()
    return id
  }

  for (let i = 0; i < PARALLEL_MONKEYS; i++) {
    monkeyRun()
  }

  const actions = [monkeyCreateEdge, monkeyCreateNode]
  async function monkeyRun() {
    const ctx = await makeCtx()
    actions[Math.round(Math.max(Math.random() - 0.3, 0))](ctx)
      .then(
        res => console.log(res),
        (err: any) => console.error(`- ERR: `, err),
      )
      .finally(() => {
        console.log(`For userId:${ctx.userId}\n`)
        setTimeout(monkeyRun, MONKEYS_WAIT)
      })
  }

  async function makeCtx(): Promise<MoodleNetExecutionContext<'session'>> {
    const userId = (await getId(NodeType.User))! // user must be
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

  const rndType = <T extends object>(_: T, ...x: (keyof T)[]) =>
    _[
      Object.keys(_)
        .filter(_ => !x.includes(_ as keyof T))
        .sort(() => Math.random() - 0.5)[0] as keyof T
    ]

  function monkeyCreateNode(ctx: MoodleNetExecutionContext) {
    const nodeType = rndType(NodeType, 'User', 'Subject')
    const info = `[${nodeType}]`
    return call<MoodleNetDomain>()(
      'ContentGraph.Node.Create',
      newFlow(),
    )({ ctx, data: fakeNode[nodeType](), nodeType }).then(() => `NODE: ${info}`)
  }
  async function monkeyCreateEdge(ctx: MoodleNetExecutionContext) {
    const edgeType = rndType(EdgeType, 'Created')
    const conn = contentGraph[edgeType].connections.sort(() => Math.random() - 0.5)[0]
    const [from, to] = await Promise.all([getId(conn.from), getId(conn.to)])
    const info = `${conn.from}:${from} -> ${edgeType} -> ${conn.to}:${to}`
    if (!(from && to)) {
      return `didn't find both nodes for ${info}`
    }
    return call<MoodleNetDomain>()(
      'ContentGraph.Edge.Create',
      newFlow(),
    )({ ctx, data: fakeEdge[edgeType](), edgeType, from, to }).then(() => `EDGE: ${info}`)
  }
})
