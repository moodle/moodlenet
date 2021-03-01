import { Id, IdKey, makeId, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { ulidKey } from '../../../../../../../lib/helpers/arango'
import { EdgeType, NodeType } from '../../../../ContentGraph.graphql.gen'
import * as fakeEdge from './fake/edge'
import * as fakeNode from './fake/node'
import { finishWrite, writeGlyph } from './out-file'

const genKeys: { [type in NodeType | EdgeType]: IdKey[] } = {} as any
const getKeyIdList = (type: NodeType | EdgeType) => getKeyList(type).map(key => ({ key, id: makeId(type, key) }))
const getKeyList = (type: NodeType | EdgeType) => {
  const list = (genKeys[type] = genKeys[type] || [])
  return list
}
const genKey = (type: NodeType | EdgeType) => {
  const key = ulidKey()
  getKeyList(type).push(key)
  return key
}

const getRndGenKey = (type: EdgeType | NodeType) => {
  const list = genKeys[type] || []
  const len = list.length
  const index = Math.floor(Math.random() * len)
  return list[index]
}
const getRndGenId = (type: EdgeType | NodeType) => makeId(type, getRndGenKey(type))

export const createNewFakeNode = ({ type, creatorKey }: { type: NodeType; creatorKey?: IdKey }) => {
  const _key = genKey(type)
  return Promise.all([
    writeGlyph(type, {
      _key,
      ...fakeNode[type](),
    }),
    ...(creatorKey
      ? [
          createNewFakeEdge({
            type: EdgeType.Created,
            _from: makeId(NodeType.User, creatorKey),
            _to: makeId(type, _key),
          }),
        ]
      : []),
  ])
}

export const createNewFakeEdge = ({ type, _from, _to }: { type: EdgeType; _from: Id; _to: Id }) => {
  const _key = genKey(type)
  return writeGlyph(type, {
    _key,
    _from,
    _to,
    from: nodeTypeFromId(_from),
    to: nodeTypeFromId(_to),
    ...fakeEdge[type](),
  })
}

const doMany = async <T>(tag: string, amount: number, fn: (i: number) => Promise<T>): Promise<(T | null)[]> => {
  const log_at = amount < 2000 ? 20 : Math.floor(amount / 100)
  let log_cnt = 0
  const results: (T | null)[] = []
  for (let i = 0; i < amount; i++) {
    if (log_cnt >= log_at || log_cnt === amount - 1) {
      log_cnt = 0

      const linelog = `${i}/${amount} : ${tag}`
      process.stdout.clearLine(0)
      process.stdout.cursorTo(0)
      process.stdout.write(linelog)
    }
    log_cnt++
    const res = await fn(i).catch(() => null)
    results.push(res)
  }
  return results
}

const SUBJECTS_AMOUNT = 10

const USERS_AMOUNT = 100000

const EACH_USER_RESOURCES_AMOUNT = 50
const EACH_USER_COLLECTIONS_AMOUNT = 15
const EACH_USER_FOLLOWS_USER_AMOUNT = 20
const EACH_USER_FOLLOWS_SUBJECT_AMOUNT = 15
const EACH_USER_FOLLOWS_COLLECTION_AMOUNT = 8
const EACH_USER_LIKES_RESOURCE_AMOUNT = 30
const EACH_COLLECTION_CONTAINS_RESOURCE_AMOUNT = 12
const EACH_COLLECTION_HAS_APPLIED_SUBJECTS_AMOUNT = 4
const EACH_RESOURCE_HAS_APPLIED_SUBJECTS_AMOUNT = 2

export const generate = async () => {
  await doMany('SUBJECTS', SUBJECTS_AMOUNT, () => {
    return createNewFakeNode({ type: NodeType.Subject })
  })
  await doMany('USERS', USERS_AMOUNT, () => {
    return createNewFakeNode({ type: NodeType.User })
  })

  const users = getKeyIdList(NodeType.User)
  const usersL = users.length
  for (let i = 0; i < usersL; i++) {
    const { key: userKey, id: userId } = users[i]

    await doMany(`${i}/${usersL} : ${userId} RESOURCES`, EACH_USER_RESOURCES_AMOUNT, () => {
      return createNewFakeNode({ type: NodeType.Resource, creatorKey: userKey })
    })
    await doMany(`${i}/${usersL} : ${userId} COLLECTIONS`, EACH_USER_COLLECTIONS_AMOUNT, () => {
      return createNewFakeNode({ type: NodeType.Collection, creatorKey: userKey })
    })

    await doMany(`${i}/${usersL} : ${userId} FOLLOWS_USER`, EACH_USER_FOLLOWS_USER_AMOUNT, () => {
      return createNewFakeEdge({ type: EdgeType.Follows, _from: userId, _to: getRndGenId(NodeType.User) })
    })
    await doMany(`${i}/${usersL} : ${userId} FOLLOWS_SUBJECT`, EACH_USER_FOLLOWS_SUBJECT_AMOUNT, () => {
      return createNewFakeEdge({ type: EdgeType.Follows, _from: userId, _to: getRndGenId(NodeType.Subject) })
    })
    await doMany(`${i}/${usersL} : ${userId} FOLLOWS_COLLECTION`, EACH_USER_FOLLOWS_COLLECTION_AMOUNT, () => {
      return createNewFakeEdge({ type: EdgeType.Follows, _from: userId, _to: getRndGenId(NodeType.Collection) })
    })
    await doMany(`${i}/${usersL} : ${userId} LIKES_RESOURCE`, EACH_USER_LIKES_RESOURCE_AMOUNT, () => {
      return createNewFakeEdge({ type: EdgeType.Likes, _from: userId, _to: getRndGenId(NodeType.Resource) })
    })
  }

  console.log(`COLLECTION EDGES`)
  const collections = getKeyIdList(NodeType.Collection)
  const collectionsL = collections.length
  for (let i = 0; i < collectionsL; i++) {
    const { id: collectionId } = collections[i]
    await doMany(
      `${i}/${collectionsL} : ${collectionId} CONTAINS_RESOURCE`,
      EACH_COLLECTION_CONTAINS_RESOURCE_AMOUNT,
      () => {
        return createNewFakeEdge({
          type: EdgeType.Contains,
          _from: collectionId,
          _to: getRndGenId(NodeType.Resource),
        })
      },
    )
    await doMany(
      `${i}/${collectionsL} : ${collectionId} HAS_APPLIED_SUBJECTS`,
      EACH_COLLECTION_HAS_APPLIED_SUBJECTS_AMOUNT,
      () => {
        return createNewFakeEdge({
          type: EdgeType.AppliesTo,
          _to: collectionId,
          _from: getRndGenId(NodeType.Subject),
        })
      },
    )
  }

  console.log(`RESOURCE EDGES`)
  const resources = getKeyIdList(NodeType.Resource)
  const resourcesL = resources.length
  for (let i = 0; i < resourcesL; i++) {
    const { id: resourceId } = resources[i]
    await doMany(
      `${i}/${resourcesL} : ${resourceId} HAS_APPLIED_SUBJECTS`,
      EACH_RESOURCE_HAS_APPLIED_SUBJECTS_AMOUNT,
      () => {
        return createNewFakeEdge({
          type: EdgeType.AppliesTo,
          _to: resourceId,
          _from: getRndGenId(NodeType.Subject),
        })
      },
    )
  }
  const stat = Object.keys(genKeys).reduce((_stat, type) => {
    return { ..._stat, [type]: genKeys[type as NodeType | EdgeType].length }
  }, {})
  console.log(stat)

  writeFileSync(join(__dirname, '_gen', 'stats.json'), JSON.stringify(stat, null, 2))

  finishWrite()
}
