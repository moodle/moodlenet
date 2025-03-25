import { email_address_schema, plain_password_schema, single_line_string_schema, url_string_schema } from '@moodle/lib-types'
import { literal, object, string } from 'zod'
import { baseUserDataSchemaConfig, generalSchemaConfig, orgInfoSchemaConfigs } from '../types'

export type generalSchemas = ReturnType<typeof generalSchemas>
export function generalSchemas({ general }: { general: generalSchemaConfig }) {
  const email = email_address_schema(string().max(general.email.max))
  const id = string().trim().min(general.id.min).max(general.id.max)
  const textSearch = string().trim().min(general.textSearch.min).max(general.textSearch.max)
  return {
    email,
    id,
    textSearch,
  }
}

export type baseUserDataSchemas = ReturnType<typeof baseUserDataSchemas>
export function baseUserDataSchemas({ baseUserData }: { baseUserData: baseUserDataSchemaConfig }) {
  const password = plain_password_schema(string().min(baseUserData.password.min).max(baseUserData.password.max))
  const displayName = string().trim().min(baseUserData.displayName.min).max(baseUserData.displayName.max).pipe(single_line_string_schema)

  return {
    password,
    displayName,
  }
}

export type orgInfoSchemas = ReturnType<typeof orgInfoSchemas>
export function orgInfoSchemas({ orgInfo: orgInfoCfg }: { orgInfo: orgInfoSchemaConfigs }) {
  const websiteUrl = string().trim().max(orgInfoCfg.websiteUrl.max).pipe(url_string_schema).or(literal(''))
  const physicalAddress = string().trim().min(orgInfoCfg.physicalAddress.min).max(orgInfoCfg.physicalAddress.max).pipe(single_line_string_schema)
  const copyright = string().trim().min(orgInfoCfg.copyright.min).max(orgInfoCfg.copyright.max).pipe(single_line_string_schema)
  const raw = {
    websiteUrl,
    physicalAddress,
    copyright,
  }
  const orgInfo = object(raw)
  return {
    raw,
    orgInfo,
  }
}
