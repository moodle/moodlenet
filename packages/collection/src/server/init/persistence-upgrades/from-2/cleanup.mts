import { Resource } from '@moodlenet/ed-resource/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Collection } from '../../sys-entities.mjs'

const removeDeletedResourcesEntriesFromCollectionsQuery = `FOR collection IN @@CollectionName
  LET filteredResourceList = collection.resourceList[* FILTER !!DOCUMENT( 
                                                                  CONCAT(
                                                                    @ResourceCollectionName,
                                                                    '/',
                                                                    CURRENT._key
                                                                    )
                                                                ) 
                                                    ] 
  FILTER filteredResourceList != collection.resourceList
  UPDATE collection WITH { resourceList: filteredResourceList } IN @@CollectionName
`
await sysEntitiesDB.query(removeDeletedResourcesEntriesFromCollectionsQuery, {
  '@CollectionName': Collection.collection.name,
  'ResourceCollectionName': Resource.collection.name,
})
