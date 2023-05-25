import assert from 'assert'
import type * as v2 from '../v2-types/v2.mjs'
import { v2_DB_ContentGraph } from './v2-db.mjs'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const v2_org = (await (
  await v2_DB_ContentGraph.query<v2.Organization>('FOR o IN Organization LIMIT 1 RETURN o')
).next())!
assert(v2_org, `Organization not found`)
console.log(`Migrating organization ${v2_org.name}`)
