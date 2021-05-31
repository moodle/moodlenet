import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { DocumentNodeByType, DocumentNodeDataByType } from '../../adapters/content-graph/arangodb/functions/types'
import { getProfileId } from '../../lib/auth/env'
import { SessionEnv } from '../../lib/auth/types'
import { QMCommand, QMModule, QMQuery } from '../../lib/qmino'

// query by id
export type ByIdAdapter = {
  getNodeById: <Type extends GQL.NodeType>(_: {
    nodeType: Type
    _key: IdKey
  }) => Promise<DocumentNodeByType<Type> | null>
}

export type ByIdInput<Type extends GQL.NodeType = GQL.NodeType> = {
  _key: IdKey
  nodeType: Type
}

export const byId = QMQuery(
  <Type extends GQL.NodeType = GQL.NodeType>({ _key, nodeType }: ByIdInput<Type>) =>
    async ({ getNodeById }: ByIdAdapter) => {
      return getNodeById({ _key, nodeType })
    },
)

// create

export type CreateAdapter = {
  storeNode: <Type extends GQL.NodeType>(_: {
    nodeType: Type
    key?: IdKey
    data: DocumentNodeDataByType<Type>
    creatorProfileId: Id
  }) => Promise<DocumentNodeByType<Type> | null>
}

export type CreateInput<Type extends GQL.NodeType = GQL.NodeType> = {
  env: SessionEnv
  key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
  nodeType: Type
  data: DocumentNodeDataByType<Type>
}

export const create = QMCommand(
  <Type extends GQL.NodeType = GQL.NodeType>({ data, key, env, nodeType }: CreateInput<Type>) =>
    async ({ storeNode }: CreateAdapter): Promise<DocumentNodeByType<Type> | GQL.CreateNodeMutationErrorType> => {
      const creatorProfileId = getProfileId(env)
      const result = await storeNode({ key, nodeType, data, creatorProfileId })
      if (!result) {
        return 'AssertionFailed'
      }
      return result
    },
)

QMModule(module)
