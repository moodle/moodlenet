import { positive_integer, url_string } from '@moodle/lib-types'

export type credits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}
export type external_content = { url: url_string; credits?: credits }

export type language_id = string
export type language = {
  id: language_id
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  type: string
  name: string
}

export type license_id = string
export type license = {
  id: license_id
  name: string
  restrictiveness: positive_integer
}
