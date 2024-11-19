import { pretty } from '@moodle/lib-types'

export function save_id_to_key<idProp extends string>(idProp: idProp) {
  return <record extends { [Prop in idProp]: string }>(record: record): pretty<record & { _key: string }> => {
    return {
      _key: record[idProp],
      ...record,
    }
  }
}

export type record_doc<record extends { [id in idProp]: string }, idProp extends string = 'id'> = pretty<
  record & { _key: string }
>
