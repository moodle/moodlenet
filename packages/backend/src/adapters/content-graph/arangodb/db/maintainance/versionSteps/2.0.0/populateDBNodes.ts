import FileFormatArray from '@moodlenet/common/dist/content-graph_2.0.0/initialData/FileFormat'
import IscedFieldArray from '@moodlenet/common/dist/content-graph_2.0.0/initialData/IscedField'
import IscedGradeArray from '@moodlenet/common/dist/content-graph_2.0.0/initialData/IscedGrade'
import LanguageArray from '@moodlenet/common/dist/content-graph_2.0.0/initialData/Language'
import LicenseArray from '@moodlenet/common/dist/content-graph_2.0.0/initialData/License'
import ResourceTypeArray from '@moodlenet/common/dist/content-graph_2.0.0/initialData/ResourceType'
import { Database } from 'arangojs'

export const populateDBNodes = async ({ db }: { db: Database }) =>
  [FileFormatArray, IscedFieldArray, IscedGradeArray, LanguageArray, LicenseArray, ResourceTypeArray].reduce(
    async (_, nodes) => {
      const firstNode = nodes[0]
      if (!firstNode) {
        throw new Error(`empty node set, skipping`)
      }
      const nodeType = firstNode._type
      console.log(`creating ${nodes.length} ${nodeType} nodes`)
      const collection = db.collection(nodeType)
      const aqlNodes = nodes.map(node => {
        const aqlNode: any = { ...node }
        delete aqlNode._permId
        aqlNode._key = node._permId
        return aqlNode
      })
      await collection.saveAll(aqlNodes)
    },
    Promise.resolve(),
  )
