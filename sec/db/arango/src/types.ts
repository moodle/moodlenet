import { pretty } from '@moodle/lib-types'

export type id_to_key<t, _id_prop extends string = 'id'> = pretty<{ _key: string } & Omit<t, _id_prop>>
export type with_key<t> = pretty<{ _key: string } & t>
export type with_id<t> = pretty<{ _id: string } & t>
export type with_rev<t> = pretty<{ _rev: string } & t>
