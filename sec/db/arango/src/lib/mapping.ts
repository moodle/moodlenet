import { id_to_key, key_to_id } from '../types'

export function id_to_key<data extends { id: string }>(data: data): id_to_key<data> {
  const copy = { ...data }
  delete (copy as any).id
  return {
    ...copy,
    _key: data.id,
  }
}
export function key_to_id<data extends { _key: string }>(data: data): key_to_id<data> {
  const copy = { ...data }
  delete (copy as any)._key
  return {
    ...copy,
    id: data._key,
  }
}
