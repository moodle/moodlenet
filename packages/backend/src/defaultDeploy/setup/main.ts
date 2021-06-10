import env from '../env'
import setupBb from './db'
const forceDrop = process.env.FORCE_DROP_DBS === 'true'
;(async () => {
  await setupBb({ env: env.db, forceDrop })
})()
