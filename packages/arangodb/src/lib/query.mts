import { QueryReq } from '../types.mjs'
import { sysDB } from './db.mjs'

export async function query(dbName: string, { q, bindVars, opts }: QueryReq) {
  const db = sysDB.database(dbName)
  const qcursor = await db.query(q, bindVars, opts).catch(e => {
    const msg = `arango query error: q:${q} bindVars:${JSON.stringify(bindVars)} opts:${JSON.stringify(
      opts,
    )}\nerror:${String(e)}`
    console.error(msg)
    throw new Error(msg, { cause: e })
  })
  const resultSet = await qcursor.all()
  return { resultSet }
}
