import { nodeSlugId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
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

export const langOptions: DropdownField = {
  ...LanguagesDropdown,
  options: iso639_3.map(lang => lang.name),
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

export const getLang = (language: any) => {
  const Lang = iso639_3.find(_ => _.name === language)
  if (!Lang) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: Lang not found: ${language}`)
  }
  const langId = nodeSlugId(Lang._type, Lang._slug)
  return { langId, Lang }
}

export const getLicense = (license: any) => {
  const License = licenses.find(_ => license?.toLowerCase().startsWith(_.code.toLowerCase()))
  if (!License) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: License not found: ${license}`)
  }
  const licenseId = nodeSlugId(License._type, License._slug)
  return { licenseId, License }
}

export const getType = (type: any) => {
  const Type = resourceTypes.find(_ => _.name === type)
  if (!Type) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: Type not found: ${type}`)
  }
  const typeId = nodeSlugId(Type._type, Type._slug)
  return { typeId, Type }
}

export const getGrade = (level: any) => {
  const Grade = iscedGrades.find(_ => _.name === level)
  if (!Grade) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: Grade not found: ${level}`)
  }
  const gradeId = nodeSlugId(Grade._type, Grade._slug)
  return { gradeId, Grade }
}

export const getIscedF = (category: any) => {
  const IscedF = iscedFields.find(_ => _.name === category)
  if (!IscedF) {
    throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: IscedF not found: ${category}`)
  }
  const iscedFId = nodeSlugId(IscedF._type, IscedF._slug)
  return { iscedFId, IscedF }
}
