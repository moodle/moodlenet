import { url_string } from '@moodle/lib-types'

export type credits = {
  owner: { name: string; url: url_string }
  provider?: { name: string; url: url_string }
}
export type external_content = { url: url_string; credits?: credits }

export type languageMeta = { _: unknown }
export type language = Record<languageId, languageMeta>

export type licenseMeta = { _: unknown }
export type license = Record<licenseId, licenseMeta>

export type languageId = 'en' | 'es' | 'it'
export type licenseId = 'cc0' | 'cc-fg' | 'cc-ct'
