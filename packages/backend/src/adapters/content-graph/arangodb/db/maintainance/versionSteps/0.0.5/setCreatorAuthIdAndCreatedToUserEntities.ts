import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Database } from 'arangojs'
import { justExecute } from '../../../../../../../lib/helpers/arango/query'

export const setCreatorAuthIdAndCreatedToUserEntities = async ({ db }: { db: Database }) => {
  console.log(`set Creator AuthId And Created To User Entities`)
  const updateUserEntitiesCollections: NodeType[] = ['Collection', 'Resource']
  return Promise.all(
    updateUserEntitiesCollections.map(updateUserEntitiesCollection => {
      const q = `
FOR n IN ${updateUserEntitiesCollection} 
  let e = (for e in Created 
            filter e._to == n._id
            limit 1
            return e )[0]
  let up = { 
    _creatorAuthId: e._authId,
    _created: e._created,
  }
  UPDATE n WITH up in ${updateUserEntitiesCollection} 
  return null`
      // console.log(q, (db as any) === justExecute)
      return justExecute(q, db)
    }),
  )
}
