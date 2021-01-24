import { Context } from '../../../../../../MoodleNetGraphQL/types'
import { NodeRead } from '../../../../ContentGraph.access.types'
import { Role } from '../../../../ContentGraph.graphql.gen'
import { nodeConstraints } from '../../../graphDefs/node-constraints'
import { Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
export const node: Types.Resolvers['Query']['node'] = async (
  _root,
  { _id, nodeType },
  ctx /* ,_info */
) => {
  const {
    access: { read: nodeRead },
  } = nodeConstraints[nodeType]

  const { db } = await DBReady
  const cursor = await db.query(`
    FOR node in ${nodeType}
    FILTER node._id == ${_str(_id)} && ${getNodeAccessFilter({ ctx, nodeRead })}
    LIMIT 1
    RETURN MERGE(node, {
          _meta: MERGE(node._meta, {
            created: MERGE(node._meta.created,{
              by: DOCUMENT(node._meta.created.by._id)
            }),
            lastUpdate: MERGE(node._meta.lastUpdate,{
              by: DOCUMENT(node._meta.lastUpdate.by._id)
            })
          })
        })
  `)
  const maybeDoc = await cursor.next()
  cursor.kill()
  return maybeDoc
}

const getNodeAccessFilter = ({
  nodeRead,
  ctx,
}: {
  nodeRead: NodeRead
  ctx: Context
}) => {
  if (nodeRead === NodeRead.Public) {
    return ` true `
  } else if (!ctx.auth) {
    return ` false `
  } else if (nodeRead === NodeRead.User) {
    return ` true `
  } else if (nodeRead === NodeRead.Protected) {
    return ` ( 
      ${ctx.auth.role === Role.Admin} 
      || ${nodeCreatorId} == "${ctx.auth.userId}" 
    ) `
  } else if (nodeRead === NodeRead.Private) {
    return ` ${nodeCreatorId} == "${ctx.auth.userId}"  `
  } else {
    // never
    throw new Error(`unknown NodeRead: ${nodeRead}`)
  }
}
const nodeCreatorId = `node._meta.created.by._id`
const _str = (_: any) => JSON.stringify(_)
