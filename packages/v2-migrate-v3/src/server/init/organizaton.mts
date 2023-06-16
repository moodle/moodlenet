import assert from 'assert'
import { shell } from '../shell.mjs'
import type * as v2 from '../v2-types/v2.mjs'
import { v2_DB_ContentGraph } from './v2-db.mjs'

export let v2_org: v2.Organization
export async function organization() {
  const _v2_org = await (
    await v2_DB_ContentGraph.query<v2.Organization>('FOR o IN Organization LIMIT 1 RETURN o')
  ).next()
  assert(_v2_org, `Organization not found`)

  v2_org = _v2_org

  shell.log('info', `Migrating organization ${v2_org.name}`)
  return { v2_org }
}
