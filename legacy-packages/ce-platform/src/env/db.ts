const ARANGO_URL = process.env.ARANGO_URL

if (!ARANGO_URL) {
  console.error('DB Env:')
  console.error({ ARANGO_URL })
  throw new Error(`some env missing or invalid`)
}

const dbenv = {
  arangoUrl: ARANGO_URL,
  userAuthDBName: 'UserAuth',
  contentGraphDBName: 'ContentGraph',
}

export type DBEnv = typeof dbenv

export default dbenv
