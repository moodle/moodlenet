import { rootUserProfile } from '@moodlenet/common/lib/content-graph/initialData/content'
import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Database } from 'arangojs'
import { aqlstr, justExecute } from '../../../../../../../lib/helpers/arango/query'

export const setIsAdminInProfiles = async ({ db }: { db: Database }) => {
  console.log(`set Proper _isAdmin To All Profiles`)
  const profileType: NodeType = 'Profile'
  const q = `    
FOR profile IN ${profileType} 
  let up = { 
    _isAdmin: profile._key == ${aqlstr(rootUserProfile._permId)} ? true : false
  }

  UPDATE profile WITH up in ${profileType} 
  
  return null`

  // console.log(q, (db as any) === justExecute)
  return justExecute(q, db)
}
