import { isEdgeNodeOfType } from '@moodlenet/common/dist/graphql/helpers'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import React, { useMemo } from 'react'
import { useGlobalSearchQuery } from '../context/Global/GlobalSearch/globalSearch.gen'
import { DropdownOptionsType } from '../ui/components/atoms/Dropdown/Dropdown'
import {
  CategoriesDropdown,
  LanguagesDropdown,
  LevelDropdown,
  LicenseDropdown,
  licenseIconMap,
  LicenseTypes,
  MonthDropdown,
  TypeDropdown,
  YearsDropdown,
} from '../ui/components/pages/NewResource/FieldsData'

export const useLanguages = () => {
  const langs = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['Language'],
      page: { first: 200 },
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () => (langs || []).filter(isEdgeNodeOfType(['Language'])),
    [langs]
  )
}
export const useLangOptions = () => {
  const langs = useLanguages()
  return useMemo(
    () => ({
      langOptions: {
        ...LanguagesDropdown,
        options: langs
          .slice()
          .sort((a, b) => (a.node.name > b.node.name ? 1 : -1))
          .map((lang) => lang.node.name),
      },
      getLang: (language: string) => {
        const Lang = (langs || []).find((_) => _.node.name === language)?.node
        if (!Lang) {
          throw new Error(
            `RESOURCE-RELATION-DATA-STATIC: should never happen: Lang not found: ${language}`
          )
        }
        return Lang
      },
    }),
    [langs]
  )
}

export const useIscedFields = () => {
  const fields = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['IscedField'],
      page: { first: 200 },
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () => (fields || []).filter(isEdgeNodeOfType(['IscedField'])),
    [fields]
  )
}
export const useIscedFieldsOptions = () => {
  const iscedFields = useIscedFields()
  return useMemo(
    () => ({
      iscedFieldsOptions: {
        ...CategoriesDropdown,
        options: iscedFields
          .slice()
          .sort((a, b) => (a.node.code > b.node.code ? 1 : -1))
          .map((cat) => cat.node.name),
      },
      getIscedF: (category: string) => {
        const IscedF = iscedFields.find((_) => _.node.name === category)?.node
        if (!IscedF) {
          throw new Error(
            `RESOURCE-RELATION-DATA-STATIC: should never happen: IscedF not found: ${category}`
          )
        }
        return IscedF
      },
    }),
    [iscedFields]
  )
}

export const useResourceTypes = () => {
  const types = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['ResourceType'],
      page: { first: 200 },
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () => (types || []).filter(isEdgeNodeOfType(['ResourceType'])),
    [types]
  )
}

export const useResourceTypeOptions = () => {
  const resourceTypes = useResourceTypes()
  return useMemo(
    () => ({
      getResourceType: (type: string) => {
        const Type = resourceTypes.find((_) => _.node.name === type)?.node
        if (!Type) {
          throw new Error(
            `RESOURCE-RELATION-DATA-STATIC: should never happen: Type not found: ${type}`
          )
        }
        return Type
      },
      resourceTypeOptions: {
        ...TypeDropdown,
        options: resourceTypes
          .slice()
          .sort((a, b) => (a.node.name > b.node.name ? 1 : -1))
          .map((restype) => restype.node.name),
      },
    }),
    [resourceTypes]
  )
}

export const useIscedGrades = () => {
  const grades = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['IscedGrade'],
      page: { first: 200 },
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () => (grades || []).filter(isEdgeNodeOfType(['IscedGrade'])),
    [grades]
  )
}
export const useResourceGradeOptions = () => {
  const iscedGrades = useIscedGrades()
  return useMemo(
    () => ({
      resourceGradeOptions: {
        ...LevelDropdown,
        options: iscedGrades
          .slice()
          .sort((a, b) =>
            a.node.code === 'ADT'
              ? +2
              : b.node.code === 'ADT'
              ? -2
              : a.node.code > b.node.code
              ? 1
              : -1
          )
          .map((grade) => grade.node.name),
      },
      getGrade: (level: string) => {
        const Grade = iscedGrades.find((_) => _.node.name === level)?.node
        if (!Grade) {
          throw new Error(
            `RESOURCE-RELATION-DATA-STATIC: should never happen: Grade not found: ${level}`
          )
        }

        return Grade
      },
    }),
    [iscedGrades]
  )
}

export const useLicenses = () => {
  const licenses = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['License'],
      page: { first: 200 },
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () => (licenses || []).filter(isEdgeNodeOfType(['License'])),
    [licenses]
  )
}
export const useLicensesOptions = () => {
  const licenses = useLicenses()

  return useMemo(() => {
    return {
      licensesOptions: {
        ...LicenseDropdown,
        options: licenses
          .slice()
          .sort((a, b) => (a.node.code.length > b.node.code.length ? 1 : -1))
          .map((license) => {
            const codeSplit = license.node.code.split('-')
            const firstToken = codeSplit.shift()
            const icons =
              firstToken === 'cc'
                ? codeSplit
                    .map((cctype) => licenseIconMap[cctype as LicenseTypes])
                    .filter(Boolean)
                : []

            const ddField: DropdownOptionsType = [
              [license.node.name, React.createElement('div', {}, ...icons)],
            ]
            return ddField[0]!
          }),
      },
      getLicense: (license: string) => {
        const License = licenses.find((_) => _.node.name === license)?.node
        if (!License) {
          throw new Error(
            `RESOURCE-RELATION-DATA-STATIC: should never happen: License not found: ${license}`
          )
        }
        return License
      },
    }
  }, [licenses])
}
export const monthOptions = {
  ...MonthDropdown,
}

export const yearsOptions = {
  ...YearsDropdown,
}

// export const getLicenseOptField = (licenseCode: string) => {
//   if (!licenseCode) {
//     return ''
//   }
//   const license = LicenseDropdown.options.find(
//     _ => !!(licenseCode && _[0]!.toLowerCase().startsWith(licenseCode.toLowerCase())),
//   )
//   if (!license) {
//     throw new Error(`RESOURCE-RELATION-DATA-STATIC: should never happen: LicenseCode not found: ${licenseCode}`)
//   }
//   return license[0]!
// }

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
  const ts = new Date(
    `${originalDateMonth} 1 ${originalDateYear} GMT`
  ).valueOf()
  if (isNaN(ts)) {
    return null
  }
  return ts
}

export const getOriginalCreationStringsByTimestamp = (ts: Maybe<number>) => {
  const date = new Date(ts ?? 'no date')
  if (isNaN(date.valueOf())) {
    return {
      originalDateMonth: '',
      originalDateYear: '',
    }
  }
  const originalDateMonth = (monthOptions.options as string[])[date.getMonth()]!
  const originalDateYear = `${date.getFullYear()}`

  return {
    originalDateMonth,
    originalDateYear,
  }
}
