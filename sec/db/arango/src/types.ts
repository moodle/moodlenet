import { pretty } from '@moodle/lib-types'

export type key_to_id<t> = pretty<{ id: string } & Omit<t, '_key'>>
export type id_to_key<t> = pretty<{ _key: string } & Omit<t, 'id'>>
export type with_key<t> = pretty<{ _key: string } & t>
export type with_id<t> = pretty<{ _id: string } & t>
export type with_rev<t> = pretty<{ _rev: string } & t>

