import { CreateEdgeInput, Id, IdKey, makeId } from '@moodlenet/common/lib/utils/content-graph'
import { newFlow } from '../../../../lib/domain/helpers'
import { ulidKey } from '../../../../lib/helpers/arango'
import { MoodleNetExecutionContext, Role } from '../../../types'
import { CreateEdgeHandler } from '../apis/ContentGraph.Edge.Create'
import { CreateNodeHandler } from '../apis/ContentGraph.Node.Create'
import { CreateNodeInput, EdgeType, NodeType } from '../ContentGraph.graphql.gen'
import { contentGraph } from '../graphDefinition'
import { ShallowNodeByType } from '../graphDefinition/types'
import * as fakeEdge from './fake/edge'
import * as fakeNode from './fake/node'
import { Just } from './fake/types'

const flow = newFlow()
const ctx = ({ userId, system = false }: { userId?: Id; system?: boolean }): { ctx: MoodleNetExecutionContext } => {
  return {
    ctx: {
      auth: userId ? { accountId: '', email: '', role: Role.User, userId, username: '' } : null,
      flow,
      system: !userId ? true : system,
    },
  }
}
const genKeys: { [name in NodeType | EdgeType]: IdKey[] } = {} as any
const addKey = (name: NodeType | EdgeType) => {
  const key = ulidKey()
  genKeys[name] = genKeys[name] || []
  genKeys[name].push(key)
  return key
}
const randomId = (type: EdgeType | NodeType) => makeId(type, randomKey(type))

const randomKey = (type: EdgeType | NodeType) => {
  const list = genKeys[type] || []
  const len = list.length
  const index = Math.floor(Math.random() * len)
  return list[index]
}

export const createNode = <N extends NodeType>({
  nodeType,
  input,
  userId,
}: {
  nodeType: N
  input: Just<CreateNodeInput[N]>
  userId?: Id
}) => {
  const key = addKey(nodeType)
  return CreateNodeHandler<N>({
    ...ctx({ userId }),
    input,
    key,
    nodeType,
  })
    .then(res => {
      if (res.__typename === 'CreateNodeMutationError') {
        //@ts-ignore
        throw `${res.type}:${res.details}`
      }
      return res as ShallowNodeByType<N>
    })
    .catch(e => console.error({ _: `createNode Err`, e, nodeType, input }))
}
export const createNewFakeNode = ({ nodeType, userId }: { nodeType: NodeType; userId?: Id }) => {
  const input = fakeNode[nodeType]()
  return createNode({ nodeType, input, userId })
}

export const createEdge = <E extends EdgeType>({
  edgeType,
  from,
  input,
  to,
}: {
  edgeType: E
  input: Just<CreateEdgeInput[E]>
  from: Id
  to: Id
}) => {
  const key = addKey(edgeType)
  return CreateEdgeHandler({
    ...ctx({}),
    input,
    key,
    edgeType,
    from,
    to,
  })
    .then(res => {
      if (res.__typename === 'CreateEdgeMutationError') {
        throw `${res.type}:${res.details}`
      }
    })
    .catch(e => console.error({ _: `createEdge Err`, e, edgeType, from, input, to }))
}
export const createNewFakeEdge = ({ edgeType, from, to }: { edgeType: EdgeType; from: Id; to: Id }) => {
  const input = fakeEdge[edgeType]()
  return createEdge({ edgeType, input, from, to })
}

export const createSomeRandomNodes = async ({
  amount,
  nodeType,
  userId,
}: {
  userId?: Id
  nodeType: NodeType
  amount: number
}) => {
  // console.log(`populate ${nodeType}`)
  for (let i = 0; i < amount; i++) {
    await createNewFakeNode({ nodeType, userId })
  }
}

export const createSomeRandomEdges = async ({ edgeType, amount }: { amount: number; edgeType: EdgeType }) => {
  const { connections } = contentGraph[edgeType]
  for (let ci = 0; ci < connections.length; ci++) {
    const conn = connections[ci]
    const fromNodeType = conn.from
    const toNodeType = conn.to
    // console.log(`populate ${fromNodeType}->${edgeType}->${toNodeType}`)
    for (let i = 0; i < amount; i++) {
      const from = randomId(fromNodeType)
      const to = randomId(toNodeType)
      await createNewFakeEdge({ edgeType, from, to })
    }
  }
}

const SUBJECTS_AMOUNT = 100

const USERS_AMOUNT = 1000
const EACH_USER_RESOURCES_AMOUNT = 20
const EACH_USER_COLLECTIONS_AMOUNT = 3
const EACH_USER_FOLLOWS_USER_AMOUNT = 8
const EACH_USER_FOLLOWS_SUBJECT_AMOUNT = 20
const EACH_USER_FOLLOWS_COLLECTION_AMOUNT = 10
const EACH_USER_LIKES_RESOURCE_AMOUNT = 10
const EACH_COLLECTION_CONTAINS_RESOURCE_AMOUNT = 20
const EACH_SUBJECT_APPLIESTO_RESOURCE_AMOUNT = 100

export const populate = async () => {
  console.log(`create some Subjects`)
  await createSomeRandomNodes({
    amount: SUBJECTS_AMOUNT,
    nodeType: NodeType.Subject,
  })

  console.log(`create some Users`)
  for (let i = 0; i < USERS_AMOUNT; i++) {
    const user = await createNewFakeNode({ nodeType: NodeType.User })
    if (user) {
      const userId = user._id as Id
      // console.log(`create some User Resources`)
      /* await */ createSomeRandomNodes({
        amount: EACH_USER_RESOURCES_AMOUNT,
        nodeType: NodeType.Resource,
        userId,
      })

      // console.log(`create some User Collections`)
      /* await */ createSomeRandomNodes({
        amount: EACH_USER_COLLECTIONS_AMOUNT,
        nodeType: NodeType.Collection,
        userId,
      })
    }
  }

  console.log(`create  Edges from Users`)
  for (const userKey of genKeys[NodeType.User]) {
    const userId = makeId(NodeType.User, userKey)

    // console.log(`create some User Follows User`)
    for (let e = 0; e < EACH_USER_FOLLOWS_USER_AMOUNT; e++) {
      const to = randomId(NodeType.User)
      /* await */ createNewFakeEdge({ edgeType: EdgeType.Follows, from: userId, to })
    }

    // console.log(`create some User Follows Subject`)
    for (let e = 0; e < EACH_USER_FOLLOWS_SUBJECT_AMOUNT; e++) {
      const to = randomId(NodeType.Subject)
      /* await */ createNewFakeEdge({ edgeType: EdgeType.Follows, from: userId, to })
    }

    // console.log(`create some User Follows Subject`)
    for (let e = 0; e < EACH_USER_FOLLOWS_SUBJECT_AMOUNT; e++) {
      const to = randomId(NodeType.Subject)
      /* await */ createNewFakeEdge({ edgeType: EdgeType.Follows, from: userId, to })
    }

    // console.log(`create some User Follows Collection`)
    for (let e = 0; e < EACH_USER_FOLLOWS_COLLECTION_AMOUNT; e++) {
      const to = randomId(NodeType.Collection)
      /* await */ createNewFakeEdge({ edgeType: EdgeType.Follows, from: userId, to })
    }

    // // console.log(`create some User Likes Resource`)
    for (let e = 0; e < EACH_USER_LIKES_RESOURCE_AMOUNT; e++) {
      const to = randomId(NodeType.Resource)
      /* await */ createNewFakeEdge({ edgeType: EdgeType.Likes, from: userId, to })
    }
  }

  console.log(`create  Edges from Collections`)
  for (const collectionKey of genKeys[NodeType.Collection]) {
    const collectionId = makeId(NodeType.Collection, collectionKey)

    // console.log(`create some Collection Contains Resource`)
    for (let e = 0; e < EACH_COLLECTION_CONTAINS_RESOURCE_AMOUNT; e++) {
      const to = randomId(NodeType.Resource)
      /* await */ createNewFakeEdge({ edgeType: EdgeType.Contains, from: collectionId, to })
    }
  }

  console.log(`create  Edges from Subjects`)
  for (const subjectKey of genKeys[NodeType.Subject]) {
    const subjectId = makeId(NodeType.Subject, subjectKey)

    // console.log(`create some Subject AppliesTo Resource`)
    for (let e = 0; e < EACH_SUBJECT_APPLIESTO_RESOURCE_AMOUNT; e++) {
      const to = randomId(NodeType.Resource)
      /* await */ createNewFakeEdge({ edgeType: EdgeType.AppliesTo, from: subjectId, to })
    }

    // console.log(`create some Subject AppliesTo Collection`)
    for (let e = 0; e < EACH_SUBJECT_APPLIESTO_RESOURCE_AMOUNT; e++) {
      const to = randomId(NodeType.Collection)
      /* await */ createNewFakeEdge({ edgeType: EdgeType.AppliesTo, from: subjectId, to })
    }
  }
}
