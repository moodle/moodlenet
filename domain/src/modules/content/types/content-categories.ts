import { fraction, url_string } from '@moodle/lib-types'

export type credits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}
export type external_content = { url: url_string; credits?: credits }

export type languageId = string
export type language = {
  id: languageId
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  type: string
  name: string
}

export type licenseId = string
export type license = {
  id: licenseId
  name: string
  restrictiveness: fraction
}
