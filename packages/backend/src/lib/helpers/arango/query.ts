import { Database } from 'arangojs'
import promiseRetry, { PromiseRetryOpts } from 'promise-retry'

declare const AQS: unique symbol
export type AqlVar = string
export type AQ<T> = string & { readonly [AQS]?: T }
export const aq = <T>(q: string) => q as AQ<T>

export const aqlstr = (_: any) => JSON.stringify(_)

export const getOneResult = async <T>(q: AQ<T>, db: Database): Promise<T | undefined> => {
  const cursor = await db.query(q).catch(e => {
    console.error(`getOneResult`, e, q)
    throw e
  })

  const result = await cursor.next()
  cursor.kill()
  return result
}

export const getAllResults = async <T>(q: AQ<T>, db: Database): Promise<T[]> => {
  const cursor = await db.query(q).catch(e => {
    console.error(`getAllResults`, e, q)
    throw e
  })
  const results = await cursor.all()
  cursor.kill()
  return results
}

export const justExecute = async (q: string, db: Database) => {
  const cursor = await db.query(q).catch(e => {
    console.error(`getOneResult`, e, q)
    throw e
  })
  cursor.kill()
  const { count, extra } = cursor
  return {
    count,
    extra,
  }
}

// TODO: hook this in helper funcs
export const queryRetry = async <T>(q: AQ<T>, db: Database, opts?: Partial<PromiseRetryOpts>) =>
  promiseRetry(
    retry => db.query(q).catch(err => (String(err?.errorNum) === '1200' ? retry(err) : Promise.reject(err))),
    opts,
  )
