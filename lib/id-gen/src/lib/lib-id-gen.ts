import * as ulidx from 'ulidx'
import { customAlphabet } from 'nanoid'
import { d_u, date_time_string } from '@moodle/lib-types'

export type id_type = d_u<
  {
    alphanumeric: { length: number }
    ulid: { onDate?: Date | number | string }
  },
  'type'
>

const globalMonoUlid = ulidx.monotonicFactory()
export async function generateUlid(cfg?: { onDate?: Date | number | string }) {
  const date = new Date(cfg?.onDate ?? date_time_string('now'))
  return globalMonoUlid(date.valueOf())
}

export async function generateNanoId(opts?: { alpabet?: string; length?: number }) {
  const id = customAlphabet(
    opts?.alpabet || `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`,
    8,
  )(opts?.length)
  return id
}

export async function generateId(id_type: id_type) {
  switch (id_type.type) {
    case 'alphanumeric':
      return generateNanoId({ length: id_type.length })
    case 'ulid':
      return generateUlid({ onDate: id_type.onDate })
  }
}
