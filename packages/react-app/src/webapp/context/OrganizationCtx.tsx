import type { OrganizationData } from '@moodlenet/organization/common'
import { createContext } from 'react'

export type TOrganizationCtx = {
  organization: { data: OrganizationData; rawData: OrganizationData }
  saveOrganization: (data: OrganizationData) => void
}

export const OrganizationCtx = createContext<TOrganizationCtx>(null as never)
