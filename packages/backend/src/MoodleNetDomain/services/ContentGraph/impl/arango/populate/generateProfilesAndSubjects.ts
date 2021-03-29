import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import { SYSTEM_PROFILE_ID } from '../../../../../MoodleNetGraphQL'
import { EdgeType, NodeType, Profile } from '../../../ContentGraph.graphql.gen'
import './env'
import { PROFILES_AMOUNT, SUBJECTS_AMOUNT } from './env'
import * as fakeNode from './fake/node'
import { finishWrite, writeNode } from './out-file'

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

export const createNewFakeNode = ({ type }: { type: NodeType }) => {
  const _key = genKey(type)
  return writeNode(type, {
    _key,
    __typename: type,
    ...fakeNode[type](),
    _meta: {
      created: new Date(),
      updated: new Date(),
      creator: { _id: SYSTEM_PROFILE_ID } as Profile,
    },
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
    return createNewFakeNode({ type: 'Subject' })
  })
  await doMany('PROFILES', PROFILES_AMOUNT, () => {
    return createNewFakeNode({ type: 'Profile' })
  })

  const stat = Object.keys(genKeys).reduce((_stat, type) => {
    return { ..._stat, [type]: genKeys[type as NodeType | EdgeType].length }
  }, {})
  console.log(stat)

  writeFileSync(join(__dirname, '_gen', 'stats.json'), JSON.stringify(stat, null, 2))

  finishWrite()
})()
