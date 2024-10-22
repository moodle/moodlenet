import { positive_integer, url_string } from '@moodle/lib-types'

export type bloom_cognitive_level = 1 | 2 | 3 | 4 | 5 | 6
export type bloomCognitive = {
  id: bloom_cognitive_level
  desc: string
  verbs: string[]
}

export type isced_field_id = string
export type iscedField = { desc: string; id: isced_field_id; subjectPath: [string, string, string]; url: url_string }

export type isced_level_id = positive_integer
export type iscedLevel = { desc: string; id: isced_level_id }


export type edu_resource_type_id = string
export type eduResourceType = { desc: string; id: edu_resource_type_id }


