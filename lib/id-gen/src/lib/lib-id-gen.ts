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
const ALPHNUM_62 = `useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict` // urlAlphabet except -_
const DEFAULT_ALPHANUM_ID_LENGTH = 8
export function generateAlphanumId(opts?: { length?: number }) {
  const length = opts?.length ?? DEFAULT_ALPHANUM_ID_LENGTH
  const restId = customAlphabet(ALPHNUM_62)(length - 5)
  const currentZeroDeltaDateAlphanum5 = getCurrentZeroDeltaDateAlphanum5()

  const alphanumId = `${currentZeroDeltaDateAlphanum5}${restId}`
  console.log({ length, restId, currentZeroDeltaDateAlphanum5, alphanumId })
  return alphanumId
}
//FIXME: REMOVE generateNanoId by renaming to generateAlphanumId
export const generateNanoId = generateAlphanumId

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

const ZERO_DATE = Number(new Date('01/01/2020'))

function getCurrentZeroDeltaDateAlphanum5() {
  const fifthSecondsFromZeroDate = Math.floor((Number(new Date()) - ZERO_DATE) / 200)

  const reversedFifthSecondsFromZeroDateStringArray = String(fifthSecondsFromZeroDate).split('').reverse()

  // ensures first reversed digit is not 0
  reversedFifthSecondsFromZeroDateStringArray[0] =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    reversedFifthSecondsFromZeroDateStringArray[0] === '0' ? '1' : reversedFifthSecondsFromZeroDateStringArray[0]!
  const base62encodingNumber = Number(reversedFifthSecondsFromZeroDateStringArray.join(''))
  const encoded62 = encodeBase62(base62encodingNumber)
  console.log({
    fifthSecondsFromZeroDate,
    reversedFifthSecondsFromZeroDateStringArray,
    base62encodingNumber,
    encoded62,
  })
  return encoded62
}

// https://lowrey.me/encoding-decoding-base-62-in-es6-javascript/
function encodeBase62(integer: number) {
  if (integer === 0) {
    return 0
  }
  let s: string[] = []
  while (integer > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    s = [ALPHNUM_62[integer % 62]!, ...s]
    integer = Math.floor(integer / 62)
  }
  return s.join('')
}
function _decodeBase62(chars: string) {
  return chars
    .split('')
    .reverse()
    .reduce((prev, curr, i) => prev + ALPHNUM_62.indexOf(curr) * 62 ** i, 0)
}
