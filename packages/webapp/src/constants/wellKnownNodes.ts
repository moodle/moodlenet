import { getIscedFields } from '@moodlenet/common/src/content-graph/initialData/ISCED/Fields/IscedFields'
import { getIscedGrades } from '@moodlenet/common/src/content-graph/initialData/ISCED/Grades/IscedGrades'
import { getIso639_3 } from '@moodlenet/common/src/content-graph/initialData/ISO_639_3/ISO_639_3'
import { getLicenses } from '@moodlenet/common/src/content-graph/initialData/licenses/licenses'
import { getResourceTypes } from '@moodlenet/common/src/content-graph/initialData/resource-type/resource-type'

export const iscedFields = getIscedFields()
export const iscedGrades = getIscedGrades()
export const iso639_3 = getIso639_3()
export const licenses = getLicenses()
export const resourceTypes = getResourceTypes()
