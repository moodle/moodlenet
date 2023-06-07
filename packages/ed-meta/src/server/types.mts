import type { EntityDocument } from '@moodlenet/system-entities/server'

export type IscedFieldEntityDoc = EntityDocument<IscedFieldDataType>
export type IscedFieldDataType = {
  codePath: string[]
  name: string
  published: boolean
}

export type IscedGradeEntityDoc = EntityDocument<IscedGradeDataType>
export type IscedGradeDataType = {
  codePath: string[]
  name: string
  published: boolean
}

export type LanguageEntityDoc = EntityDocument<LanguageDataType>
export type LanguageDataType = {
  code: string
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  type: string
  name: string
  published: boolean
}

export type EdAssetTypeEntityDoc = EntityDocument<EdAssetTypeDataType>
export type EdAssetTypeDataType = { code: string; description: string; published: boolean }

export type LicenseEntityDoc = EntityDocument<LicenseDataType>
export type LicenseDataType = { code: string; description: string; published: boolean }
