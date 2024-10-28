import { fraction, url_string } from '@moodle/lib-types'

export type contentCredits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}
export type external_content = { url: url_string; credits?: contentCredits }

export type contentLanguageCode = string
export type contentLanguageRecord = {
  code: contentLanguageCode
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  type: string
  name: string
}

export type contentLicenseCode = string
export type contentLicenseRecord = {
  code: contentLicenseCode
  name: string
  restrictiveness: fraction
}
