import { fract, url_string } from '@moodle/lib-types'

export type credits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}

export type languageCode = string
export type language = {
  code: languageCode
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  type: string
  name: string
}

export type licenseCode = string
export type license = {
  code: licenseCode
  name: string
  restrictiveness: fract
}
