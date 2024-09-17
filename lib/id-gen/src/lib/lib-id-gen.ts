import * as ulidx from 'ulidx'
import { customAlphabet } from 'nanoid'
import { d_u } from '@moodle/lib-types'

export type id_type = d_u<
  {
    alphanumeric: { length: number }
    ulid: { onDate?: Date | number | string }
  },
  'type'
>

const globalMonoUlid = ulidx.monotonicFactory()
export async function generateUlid({ onDate }: { onDate: Date | number | string }) {
  const date = new Date(onDate)
  return globalMonoUlid(date.valueOf())
}

export async function generateAlphaNumericId(opts?: { alpabet?: string; length?: number }) {
  const id = customAlphabet(
    opts?.alpabet || `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`,
    8,
  )(opts?.length)
  return id
}

export async function generateId(id_type: id_type) {
  switch (id_type.type) {
    case 'alphanumeric':
      return generateAlphaNumericId({ length: id_type.length })
    case 'ulid':
      return generateUlid({ onDate: id_type.onDate ?? Date.now() })
  }
}
