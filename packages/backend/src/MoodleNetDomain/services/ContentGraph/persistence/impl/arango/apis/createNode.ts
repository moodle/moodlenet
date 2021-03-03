// import { CreateNodeMutationErrorType } from '../../../../ContentGraph.graphql.gen'
// import { getStaticFilteredNodeBasicAccessPolicy } from '../../../../graphDefinition/helpers'
import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { createNodeMetaString, mergeNodeMeta } from './helpers'

export const createNode: ContentGraphPersistence['createNode'] = async ({ /* ctx, */ data, nodeType, key }) => {
  const { db } = await DBReady()
  // const { graph } = await DBReady()
  //FIXME: ! check policy
  // const policy = getStaticFilteredNodeBasicAccessPolicy({
  //   accessType: 'create',
  //   nodeType,
  //   ctx,
  // })
  // if (!(policy)) {
  //   return {
  //     __typename: 'CreateNodeMutationError',
  //     type: CreateNodeMutationErrorType.NotAuthorized,
  //   }
  // }
  // const nodeAccessFilter = getGlyphBasicAccessFilter({
  //   glyphTag: 'node',
  //   policy,
  //   ctx,
  //   engine: basicAccessFilterEngine,
  // })

  // const collection = graph.vertexCollection(nodeType)
  // const { new: node } = await collection.save({ ...data, _key: key }, { returnNew: true })
  const q = `
    LET node = ${aqlstr({ ...data, _key: key })}
    INSERT ${mergeNodeMeta({
      mergeMeta: createNodeMetaString({}),
      nodeProp: 'node',
    })} 
    INTO ${nodeType}
    RETURN NEW
  `
  const cursor = await db.query(q)
  const node = await cursor.next()
  cursor.kill()
  return node
}
