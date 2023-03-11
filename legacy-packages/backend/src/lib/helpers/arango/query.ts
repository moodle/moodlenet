import { Database } from 'arangojs'
import promiseRetry from 'promise-retry'

declare const AQS: unique symbol
export type AqlVar = string
export type AQ<T> = string & { readonly [AQS]: T }
export const aq = <T>(q: string) => q as AQ<T>

export const aqlstr = (_: any) => JSON.stringify(_)

export const getOneResult = async <T>(q: AQ<T> | string, db: Database): Promise<T | null> => {
  const cursor = await db.query(q).catch(e => {
    // console.error(`getOneResult`, e, q)
    throw e
  })

  const result = await cursor.next()
  cursor.kill()
  return result ?? null
}

export const getAllResults = async <T>(q: AQ<T>, db: Database): Promise<T[]> => {
  const cursor = await db.query(q).catch(e => {
    // console.error(`getAllResults`, e, q)
    throw e
  })
  const results = await cursor.all()
  cursor.kill()
  return results
}

export const justExecute = async (q: string, db: Database) => {
  const cursor = await db.query(q).catch(e => {
    // console.error(`getOneResult`, e, q)
    throw e
  })
  cursor.kill()
  const { count, extra } = cursor
  return {
    count,
    extra,
  }
}

// hook this in helper funcs
type PromiseRetryOpts = {
  retries?: number | undefined
  forever?: boolean | undefined
  unref?: boolean | undefined
  maxRetryTime?: number | undefined
}
export const queryRetry = async <T>(q: AQ<T>, db: Database, opts?: PromiseRetryOpts) =>
  promiseRetry(
    retry =>
      db
        .query(q)
        .catch(err => (String(err?.errorNum) === '1200' ? retry(err) : Promise.reject(err))),
    opts,
  )
