import { GraphNodeType, Slug } from '@moodlenet/common/lib/content-graph/types/node'
import { aq } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType } from '../types'
import { documentBySlugType } from './helpers'

export const getNodeBySlugQ = <Type extends GraphNodeType = GraphNodeType>({
  slug,
  type,
}: {
  slug: Slug
  type: Type
}) => {
  const q = aq<AqlGraphNodeByType<Type>>(`
    let node = ${documentBySlugType({ _slug: slug, _type: type })}

    return node
  `)
  return q
}
