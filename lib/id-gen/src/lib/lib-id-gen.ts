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

export function generateNanoId(opts?: { alpabet?: string; length?: number }) {
  const id = customAlphabet(
    //opts?.alpabet || urlAlphabet,
    opts?.alpabet || `useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict`, // urlAlphabet except -_
    8,
  )(opts?.length)
  return id
}

export function generateId(id_type: id_type) {
  switch (id_type.type) {
    case 'alphanumeric':
      return generateNanoId({ length: id_type.length })
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
