import { date_time_string } from '@moodle/lib-types'
import { collectionOfEduResourcesRecord, eduResourceRecord } from '../../edu/types/edu-content'

export type myContent = {
  eduResources: myEduResource[]
  collectionOfEduResources: myCollectionOfEduResources[]
}

export type myEduResource = {
  data: eduResourceRecord
  created: date_time_string
}

export type myCollectionOfEduResources = {
  data: collectionOfEduResourcesRecord
  created: date_time_string
}
