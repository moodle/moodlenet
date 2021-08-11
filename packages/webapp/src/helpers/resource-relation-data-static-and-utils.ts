import { nodeSlugId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { iscedFields, iscedGrades, iso639_3, licenses, resourceTypes } from '../constants/wellKnownNodes'
import {
  CategoriesDropdown,
  DropdownField,
  LanguagesDropdown,
  LevelDropdown,
  LicenseDropdown,
  MonthDropdown,
  TypeDropdown,
  YearsDropdown,
} from '../ui/pages/NewResource/FieldsData'

const mainLangs = iso639_3.filter(_ => !!_.part1)

export const langOptions: DropdownField = {
  ...LanguagesDropdown,
  options: mainLangs.map(lang => lang.name),
}

export const categoriesOptions: DropdownField = {
  ...CategoriesDropdown,
  options: iscedFields.map(cat => cat.name),
}

export const resTypeOptions: DropdownField = {
  ...TypeDropdown,
  options: resourceTypes.map(restype => restype.name),
}

export const resGradeOptions: DropdownField = {
  ...LevelDropdown,
  options: iscedGrades.map(grade => grade.name),
}

export const licensesOptions = {
  ...LicenseDropdown,
}

export const monthOptions = {
  ...MonthDropdown,
}

export const yearsOptions = {
  ...YearsDropdown,
}

export const getLang = (language: string | null | undefined) => {
  const Lang = mainLangs.find(_ => _.name === language)
  if (!Lang) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: Lang not found: ${language}`)
  }
  const langId = nodeSlugId(Lang._type, Lang._slug)
  return { langId, Lang }
}

export const getLicenseOptField = (licenseCode: string | null | undefined) => {
  if (!licenseCode) {
    return ''
  }
  const license = LicenseDropdown.options.find(
    _ => !!(licenseCode && _[0]!.toLowerCase().startsWith(licenseCode.toLowerCase())),
  )
  if (!license) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: LicenseCode not found: ${licenseCode}`)
  }
  return license[0]!
}

export const getLicense = (license: string | null | undefined) => {
  const License = licenses.find(_ => license?.toLowerCase().startsWith(`${_.code.toLowerCase()} `))
  if (!License) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: License not found: ${license}`)
  }
  const licenseId = nodeSlugId(License._type, License._slug)
  return { licenseId, License }
}

export const getType = (type: string | null | undefined) => {
  const Type = resourceTypes.find(_ => _.name === type)
  if (!Type) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: Type not found: ${type}`)
  }
  const typeId = nodeSlugId(Type._type, Type._slug)
  return { typeId, Type }
}

export const getGrade = (level: string | null | undefined) => {
  const Grade = iscedGrades.find(_ => _.name === level)
  if (!Grade) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: Grade not found: ${level}`)
  }
  const gradeId = nodeSlugId(Grade._type, Grade._slug)
  return { gradeId, Grade }
}

export const getIscedF = (category: string | null | undefined) => {
  const IscedF = iscedFields.find(_ => _.name === category)
  if (!IscedF) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: IscedF not found: ${category}`)
  }
  const iscedFId = nodeSlugId(IscedF._type, IscedF._slug)
  return { iscedFId, IscedF }
}

export const getOriginalCreationTimestampByStrings = ({
  originalDateMonth,
  originalDateYear,
}: {
  originalDateMonth: string | null
  originalDateYear: string | null
}) => {
  if (!(originalDateMonth && originalDateYear)) {
    return null
  }
  const ts = new Date(`${originalDateMonth} 1 ${originalDateYear} GMT`).valueOf()
  if (isNaN(ts)) {
    return null
  }
  return ts
}

export const getOriginalCreationStringsByTimestamp = (ts: Maybe<number>) => {
  const date = new Date(ts ?? 'no date')
  console.log({
    date,
    ts,
  })
  if (isNaN(date.valueOf())) {
    return {
      originalDateMonth: '',
      originalDateYear: '',
    }
  }
  const originalDateMonth = (monthOptions.options as string[])[date.getMonth()]!
  const originalDateYear = `${date.getFullYear()}`
  console.log({
    originalDateMonth,
    originalDateYear,
  })
  return {
    originalDateMonth,
    originalDateYear,
  }
}
