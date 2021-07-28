import { GraphNodeByType, GraphNodeType, Slug } from '@moodlenet/common/lib/content-graph/types/node'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { SessionEnv } from '../../lib/auth/types'
import { QMModule, QMQuery } from '../../lib/qmino'

// query by id
export type BySlugAdapter = {
  getNodeBySlug: <Type extends GraphNodeType>(_: { type: Type; slug: Slug }) => Promise<Maybe<GraphNodeByType<Type>>>
}

export type BySlugInput<Type extends GraphNodeType> = {
  slug: Slug
  type: Type
  env: SessionEnv | null
}

export const getBySlug = QMQuery(
  <Type extends GraphNodeType>({ type, slug }: BySlugInput<Type>) =>
    async ({ getNodeBySlug }: BySlugAdapter) => {
      return getNodeBySlug({ slug, type })
    },
)

QMModule(module)

// create

// export type CreateAdapter = {
//   storeNode: <Type extends GQL.NodeType>(_: {
//     nodeType: Type
//     data: ShallowNodeByType<Type>
//     creatorProfileId: Id
//   }) => Promise<DocumentNodeByType<Type> | null>
// }

// export type CreateNode = {
//   env: SessionEnv
//   data:
//     | (GQL.CreateCollectionInput & { __typename: 'Collection' })
//     | (GQL.CreateResourceInput & { __typename: 'Resource' })
// }

// export const create = QMCommand(
//   (createData: CreateNode) =>
//     async ({ storeNode }: CreateAdapter): Promise<ShallowNode | GQL.CreateNodeMutationErrorType> => {
//       const creatorProfileId = getProfileId(env)
//       const data = getNewNodeData(createData)
//       const result = await storeNode({ data, creatorProfileId })
//       if (!result) {
//         return 'AssertionFailed'
//       }
//       return result
//     },
// )

// const getNewNodeData = async ({ data, env }: CreateNode): ShallowNode => {
//   if (data.__typename === 'Collection') {
//     const [id, slug, key] = newGlyphIdentifiers(data.name, data.__typename)
//     const collection: ShallowNodeByType<'Collection'> = {
//       __typename: 'Collection',
//       id,
//       slug,
//       name: data.name,
//       description: data.description,
//       image: data.image,
//     }
//     return collection
//   } else if (data.__typename === 'Resource') {
//     const [id, slug, _key] = newGlyphIdentifiers(data.name, data.__typename)
//     const resource: ShallowNodeByType<'Resource'> = {
//       __typename: 'Resource',
//       id,
//       slug,
//       name: data.name,
//       content: data.content,
//       contentType: data.contentType,
//       description: data.description,
//       thumbnail: data.thumbnail,
//     }
//   }
//   throw new Error(`can't create nodeType ${data.__typename}`)
// }
