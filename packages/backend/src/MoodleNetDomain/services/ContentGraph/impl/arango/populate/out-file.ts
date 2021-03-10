import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { createWriteStream, WriteStream } from 'fs'
import { join } from 'path'
import { EdgeType, NodeType } from '../../../ContentGraph.graphql.gen'
import { ShallowEdge, ShallowNode } from '../../../types.node'
import { GEN_DIR } from './env'

console.log(`bulk dir :${GEN_DIR}`)
const writers: { [type in NodeType | EdgeType]: WriteStream } = {} as any
const getOutFilename = (type: NodeType | EdgeType) => {
  const prefix = type in NodeType ? 'nodes' : 'edges'
  return join(GEN_DIR, `${prefix}_${type}`)
}
const getWriter = (type: NodeType | EdgeType) =>
  (writers[type] = writers[type] || createWriteStream(getOutFilename(type), { encoding: 'utf-8' }))

export const writeGlyph = (type: NodeType | EdgeType, glyph: WriteGlyph) =>
  new Promise<void>((res, rej) => {
    const writer = getWriter(type)
    const data = JSON.stringify(glyph) + '\n'
    writer.write(data, err => (err ? res() : rej(err)))
  })

export const finishWrite = () => {
  Object.keys(writers).map(type => {
    const writer = writers[type as NodeType]
    writer.close()
  })
}

type WriteGlyph = WriteEdge | WriteNode
type WriteEdge = Omit<
  ShallowEdge & { from: NodeType; to: NodeType; _from: Id; _to: Id },
  '_id' | '__typename' | '_meta'
> & {
  _key: IdKey
}
type WriteNode = Omit<ShallowNode, '_id' | '__typename' | '_meta' | '_rel'> & { _key: IdKey }
