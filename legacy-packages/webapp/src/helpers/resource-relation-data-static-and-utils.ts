import { isEdgeNodeOfType } from '@moodlenet/common/dist/graphql/helpers'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { useMemo } from 'react'
import { useGlobalSearchQuery } from '../context/Global/GlobalSearch/globalSearch.gen'
import {
  LicenseNodeKey,
  LicenseNodes,
} from '../ui/components/pages/NewResource/FieldsData'

export const useLanguages = () => {
  const langs = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['Language'],
      page: { first: 200 },
      publishedOnly: true,
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () =>
      (langs || [])
        .filter(isEdgeNodeOfType(['Language']))
        .sort((a, b) => (a.node.name > b.node.name ? 1 : -1))
        .map(({ node }) => node),
    [langs]
  )
}

export const useIscedFields = () => {
  const fields = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['IscedField'],
      page: { first: 200 },
      publishedOnly: true,
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () =>
      (fields || [])
        .filter(isEdgeNodeOfType(['IscedField']))
        .sort((a, b) => (a.node.code > b.node.code ? 1 : -1))
        .map(({ node }) => node),
    [fields]
  )
}

export const useResourceTypes = () => {
  const types = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['ResourceType'],
      page: { first: 200 },
      publishedOnly: true,
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () =>
      (types || [])
        .filter(isEdgeNodeOfType(['ResourceType']))
        .sort((a, b) => (a.node.name > b.node.name ? 1 : -1))
        .map(({ node }) => node),
    [types]
  )
}

export const useIscedGrades = () => {
  const grades = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['IscedGrade'],
      page: { first: 200 },
      publishedOnly: true,
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () =>
      (grades || [])
        .filter(isEdgeNodeOfType(['IscedGrade']))
        .sort((a, b) =>
          a.node.code === 'ADT'
            ? +2
            : b.node.code === 'ADT'
            ? -2
            : a.node.code > b.node.code
            ? 1
            : -1
        )
        .map(({ node }) => node),
    [grades]
  )
}

export const useLicenses = () => {
  const licenses = useGlobalSearchQuery({
    variables: {
      text: '',
      nodeTypes: ['License'],
      page: { first: 200 },
      publishedOnly: true,
    },
    fetchPolicy: 'cache-first',
  }).data?.globalSearch.edges
  return useMemo(
    () =>
      (licenses || [])
        .filter(isEdgeNodeOfType(['License']))
        .sort((a, b) => (a.node.code.length > b.node.code.length ? 1 : -1))
        .map(({ node }) => {
          const maybeCCType = node.code.split('-').slice(1).join('-')
          const icon = LicenseNodes[maybeCCType as LicenseNodeKey] ?? null
          return [node, icon] as const
        }),
    [licenses]
  )
}

export const getOriginalCreationTimestampByStrings = ({
  month,
  year,
}: {
  month: string | null | undefined
  year: string | null | undefined
}) => {
  if (!year) {
    return null
  }
  const ts = Date.UTC(Number(year), Number(month ?? 0))
  if (isNaN(ts)) {
    return null
  }
  return ts
}

export const getOriginalCreationLocaleStringsByTimestamp = (
  ts: Maybe<number>
) => {
  const date = new Date(ts ?? 'no date')
  if (isNaN(date.valueOf())) {
    return {
      month: '',
      year: '',
    }
  }
  const _locale = navigator?.language ?? 'en-GB'
  const month = date.toLocaleString(_locale, { month: 'long' })
  const year = date.toLocaleString(_locale, { year: 'numeric' })

  return {
    month,
    year,
  }
}
