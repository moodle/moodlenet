import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Profile } from '../../sys-entities.mjs'

const ProfileCollectionName = Profile.collection.name
await sysEntitiesDB.query(`
FOR profile IN ${ProfileCollectionName}
  let updatedProfile = MERGE( UNSET(profile, 'kudos'), { points: 0 } )
  UPDATE profile WITH updatedProfile IN ${ProfileCollectionName}
`)
