import { fraction, url_string } from '@moodle/lib-types'

export type contentCredits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}
export type external_content = { url: url_string; credits?: contentCredits }

export type contentLanguageId = string
export type contentLanguageRecord = {
  id: contentLanguageId
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  type: string
  name: string
}

export type contentLicenseId = string
export type contentLicenseRecord = {
  id: contentLicenseId
  name: string
  restrictiveness: fraction
}
