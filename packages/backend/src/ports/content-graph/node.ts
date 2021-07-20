import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { DocumentNodeByType, DocumentNodeDataByType } from '../../adapters/content-graph/arangodb/functions/types'
import { getProfileId } from '../../lib/auth/env'
import { SessionEnv } from '../../lib/auth/types'
import { newGlyphKey } from '../../lib/helpers/arango'
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
    data: DocumentNodeDataByType<Type>
    creatorProfileId: Id
    key: string
  }) => Promise<DocumentNodeByType<Type> | null>
}

export type CreateInput<Type extends GQL.NodeType = GQL.NodeType> = {
  env: SessionEnv
  nodeType: Type
  data: DocumentNodeDataByType<Type>
}

export const create = QMCommand(
  <Type extends GQL.NodeType = GQL.NodeType>({ data, env, nodeType }: CreateInput<Type>) =>
    async ({ storeNode }: CreateAdapter): Promise<DocumentNodeByType<Type> | GQL.CreateNodeMutationErrorType> => {
      const creatorProfileId = getProfileId(env)
      const key = NamedKeysOnNodeTypes.includes(nodeType) ? data.name : newGlyphKey()

      const result = await storeNode({ nodeType, data, key, creatorProfileId })
      if (!result) {
        return 'AssertionFailed'
      }
      return result
    },
)
const NamedKeysOnNodeTypes: GQL.NodeType[] = ['Domain', 'Profile', 'SubjectField']
QMModule(module)
