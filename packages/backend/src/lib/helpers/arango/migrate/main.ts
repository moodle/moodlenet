import { Database } from 'arangojs'
import { resolve } from 'path'
import semverValid from 'semver/functions/valid'
import { initialSetUp, stepDB, stepDBTo } from './lib'
import { Version } from './types'

const [arangoUrl, dbname, ladderPath, step] = process.argv.slice(2)

console.log(`start\n${[arangoUrl, dbname, ladderPath, step].join('\n')}\n`)

if (!(arangoUrl && dbname && ladderPath && step)) {
  throw new Error(`missing something:${JSON.stringify({ arangoUrl, dbname, ladderPath, step })}`)
}

const ladderPathResolved = resolve(process.cwd(), ladderPath)
console.log(`ladderPathResolved ${ladderPathResolved}`)

const ladder = require(ladderPathResolved)
// console.log('ladder', ladder)

const db = new Database({ databaseName: dbname, url: arangoUrl })
if (['up', 'down'].includes(step)) {
  stepDB({ ladder, dir: step as 'up' | 'down' })({ db }).then(exit(db))
} else if (['init'].includes(step)) {
  const sys_db = new Database({ url: arangoUrl })
  db.exists().then(async exists => {
    if (exists) {
      console.log(`db ${dbname} exists, dropping`)
      //TODO: add a special check for dropping, e.g. an env var DROP_DB=dbmane
      await sys_db.dropDatabase(dbname)
    }
    console.log(`creating db ${dbname}`)
    const db = await sys_db.createDatabase(dbname)
    await initialSetUp({ ladder })({ db })
    exit(db, sys_db)('done')
  })
} else if (semverValid(step)) {
  stepDBTo({ ladder, targetVersion: step as Version })({ db }).then(exit(db))
} else {
  exit(db)(`step shall be one of [up|down|init|targetVersion] found "${step}"`)
}

function exit(...dbs: Database[]) {
  return async (_: any) => {
    console.log(`exit with`, _)
    await Promise.all(dbs.map(db => db.close()))
    process.exit()
  }
}
