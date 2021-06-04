import { Database } from 'arangojs'
import { resolve } from 'path'
import { initialSetUp, stepDB } from './lib'

const [arangoUrl, dbname, cmd, ladderPath] = process.argv.slice(2)

console.log(`start ${[arangoUrl, dbname, cmd, ladderPath]}`)

if (!(arangoUrl && dbname && cmd && ladderPath)) {
  throw new Error(`missing something:${JSON.stringify({ arangoUrl, dbname, cmd, ladderPath })}`)
}

const ladderPathResolved = resolve(process.cwd(), ladderPath)
console.log(`ladderPathResolved ${ladderPathResolved}`)

const ladder = require(ladderPathResolved)
// console.log('ladder', ladder)

const db = new Database({ databaseName: dbname, url: arangoUrl })
if (['up', 'down'].includes(cmd)) {
  stepDB({ ladder, dir: cmd as 'up' | 'down' })({ db }).then(exit(db))
} else if (['init'].includes(cmd)) {
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
    exit(db)
  })
} else {
  throw new Error(`cmd shall be one of [up|down|init] found "${cmd}"`)
}

function exit(db: Database) {
  return async (_: any) => {
    console.log(`exit with`, _)
    await db.close()
    process.exit()
  }
}
