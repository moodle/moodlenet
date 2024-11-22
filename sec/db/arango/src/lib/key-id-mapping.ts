import { pretty } from '@moodle/lib-types'

export function save_id_to_key<keyProp extends string>(keyProp: keyProp) {
  return <record extends { [_keyProp in keyProp]: string }>(record: record): record_doc<record, keyProp> => {
    return {
      _key: record[keyProp],
      _key_prop: keyProp,
      ...record,
    }
  }
}

export type record_doc<record extends { [_keyProp in keyProp]: string }, keyProp extends string = 'id'> = pretty<
  record & { _key: string; _key_prop: keyProp }
>
