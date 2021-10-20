import { getFileFormats } from '@moodlenet/common/lib/content-graph/initialData/file-format/fileFormats'
import { getIscedGrades } from '@moodlenet/common/lib/content-graph/initialData/ISCED/Grades/IscedGrades'
// import { getIso639_3 } from '@moodlenet/common/lib/content-graph/initialData/ISO_639_3/ISO_639_3'
import { getLicenses } from '@moodlenet/common/lib/content-graph/initialData/licenses/licenses'
import { getResourceTypes } from '@moodlenet/common/lib/content-graph/initialData/resource-type/resource-type'

// export const iscedFields = getSelectedIscedFields()
export const iscedGrades = getIscedGrades()
// export const iso639_3 = getIso639_3()
export const licenses = getLicenses()
export const resourceTypes = getResourceTypes()
export const fileFormats = getFileFormats()
