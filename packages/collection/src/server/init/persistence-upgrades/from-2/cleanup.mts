import { Resource } from '@moodlenet/ed-resource/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Collection } from '../../sys-entities.mjs'

const removeDeletedResourcesEntriesFromCollectionsQuery = `FOR collection IN \`${Collection.collection.name}\`
  LET filteredResourceList = collection.resourceList[* FILTER !!DOCUMENT( 
                                                                  CONCAT(
                                                                    ${Resource.collection.name},
                                                                    '/',
                                                                    CURRENT._key
                                                                    )
                                                                ) 
                                                    ] 
  FILTER filteredResourceList != collection.resourceList
  UPDATE collection WITH { resourceList: filteredResourceList } IN \`${Collection.collection.name}\`
`
await sysEntitiesDB.query(removeDeletedResourcesEntriesFromCollectionsQuery)
