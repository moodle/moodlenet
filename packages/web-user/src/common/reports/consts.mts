import type { ReportOptionType, ReportOptionTypeId, ReportProfileReasonName } from '../types.mjs'

// export const reportOptionTypes: ReportOptionType[] = [
//   { id: 'inappropriate_behavior', name: 'Inappropriate behavior' },
//   { id: 'impersonation', name: 'Impersonation' },
//   { id: 'spamming', name: 'Spamming' },
//   { id: 'terms_of_service_violation', name: 'Terms of service violation' },
//   { id: 'other', name: 'Other' },
// ]

export const reportOptionTypeMap: Record<ReportOptionTypeId, ReportProfileReasonName> = {
  inappropriate_behavior: 'Inappropriate behavior',
  impersonation: 'Impersonation',
  spamming: 'Spamming',
  terms_of_service_violation: 'Terms of service violation',
  other: 'Other',
} as const
export const reportOptionTypes: ReportOptionType[] = Object.entries(
  reportOptionTypeMap,
).map<ReportOptionType>(([id, name]) => ({ id: id as ReportOptionTypeId, name }))

export function getReportOptionType(id: ReportOptionTypeId): ReportOptionType {
  const found = reportOptionTypes.find(type => type.id === id)
  if (!found) {
    throw new Error(`Report option type not found: ${id}`)
  }
  return found
}
