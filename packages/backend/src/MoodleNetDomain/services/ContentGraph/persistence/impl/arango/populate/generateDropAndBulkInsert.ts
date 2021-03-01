import { dropGraphAndBulkInsertDir } from './bulk-insert'
import './env'
import { generate } from './generate'
import { GEN_DIR } from './out-file'

generate().then(() => {
  dropGraphAndBulkInsertDir(GEN_DIR)
})
