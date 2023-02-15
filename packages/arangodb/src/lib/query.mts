import { QueryReq } from '../types.mjs'
import { sysDB } from './db.mjs'

export async function queryDb(dbName: string, { q, bindVars, opts }: QueryReq) {
  const db = sysDB.database(dbName)

  const qcursor = await db.query(q, bindVars, opts).catch(e => {
    const msg = `Arango query error: 
    DB: ${dbName}
    q: ${q} 
    bindVars: ${JSON.stringify(bindVars)} 
    opts: ${JSON.stringify(opts)}
    error: ${String(e)}
    ${e instanceof Error && e.stack ? `stack trace:${e.stack}` : ''}`
    throw new Error(msg, { cause: e })
  })

  return qcursor
}

export async function queryDbRs(dbName: string, { q, bindVars, opts }: QueryReq) {
  const qcursor = await queryDb(dbName, { q, bindVars, opts })

  const resultSet = await qcursor.all()
  return { resultSet }
}
