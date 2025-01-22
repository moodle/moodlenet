//import { urlAlphabet } from 'nanoid'
import { d_u } from '@moodle/lib-types'
import { customAlphabet } from 'nanoid'
import * as ulidx from 'ulidx'

export type id_type = d_u<
  {
    alphanumeric: { length: number }
    ulid: { onDate: Date | number | string }
  },
  'type'
>
const globalMonoUlid = ulidx.monotonicFactory()
export function generateUlid({ onDate }: { onDate: Date | number | string }) {
  const date = new Date(onDate)
  return globalMonoUlid(date.valueOf())
}
const WEBSAFE_ALPHNUM_62 = `useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict` // nanoid#urlAlphabet except -_
const DEFAULT_ALPHANUM_ID_LENGTH = 8
export function generateAlphanumId(opts?: { length?: number }) {
  const alphanumId = customAlphabet(WEBSAFE_ALPHNUM_62, DEFAULT_ALPHANUM_ID_LENGTH)(opts?.length)
  return alphanumId
}

export function generateId(id_type: id_type) {
  switch (id_type.type) {
    case 'alphanumeric':
      return generateAlphanumId({ length: id_type.length })
    case 'ulid':
      return generateUlid({ onDate: id_type.onDate })
  }
}

export function decodeUlid(ulid: string) {
  if (!ulidx.isValid(ulid)) {
    return null
  }
  return ulidx.decodeTime(ulid)
}
