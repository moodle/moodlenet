import { Id, IdKey, makeId, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import { EdgeType, NodeType } from '../../../ContentGraph.graphql.gen'
import './env'
import { SUBJECTS_AMOUNT, USERS_AMOUNT } from './env'
import * as fakeEdge from './fake/edge'
import * as fakeNode from './fake/node'
import { finishWrite, writeGlyph } from './out-file'

const genKeys: { [type in NodeType | EdgeType]: IdKey[] } = {} as any
// const getKeyIdList = (type: NodeType | EdgeType) => getKeyList(type).map(key => ({ key, id: makeId(type, key) }))
const getKeyList = (type: NodeType | EdgeType) => {
  const list = (genKeys[type] = genKeys[type] || [])
  return list
}
const genKey = (type: NodeType | EdgeType) => {
  const key = ulidKey()
  getKeyList(type).push(key)
  return key
}

// const getRndGenKey = (type: EdgeType | NodeType) => {
//   const list = genKeys[type] || []
//   const len = list.length
//   const index = Math.floor(Math.random() * len)
//   return list[index]
// }
// const getRndGenId = (type: EdgeType | NodeType) => makeId(type, getRndGenKey(type))

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

;(async function () {
  await doMany('SUBJECTS', SUBJECTS_AMOUNT, () => {
    return createNewFakeNode({ type: NodeType.Subject })
  })
  await doMany('USERS', USERS_AMOUNT, () => {
    return createNewFakeNode({ type: NodeType.User })
  })

  const stat = Object.keys(genKeys).reduce((_stat, type) => {
    return { ..._stat, [type]: genKeys[type as NodeType | EdgeType].length }
  }, {})
  console.log(stat)

  writeFileSync(join(__dirname, '_gen', 'stats.json'), JSON.stringify(stat, null, 2))

  finishWrite()
})()
