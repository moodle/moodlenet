import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { Id } from '../graphDefinition/types'
import { ShallowNode } from '../persistence/types'

export type NodeByIdApi = Api<{ _id: Id }, { node: ShallowNode | null }>

export const NodeByIdApiHandler = async () => {
  const { findNode } = await getContentGraphPersistence()

  const handler: RespondApiHandler<NodeByIdApi> = async ({ req: { _id } }) => {
    const node = await findNode({
      _id,
    })
    return { node }
  }

  return handler
}
