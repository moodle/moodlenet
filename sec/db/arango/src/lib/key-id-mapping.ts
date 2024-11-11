import { pretty } from '@moodle/lib-types'

export function save_id_to_key<idProp extends string>(idProp: idProp) {
  return <record extends { [Prop in idProp]: string }>(record: record): pretty<Omit<record, idProp> & { _key: string }> => {
    return {
      _key: record[idProp],
      ...record,
      id: undefined,
    }
  }
}
