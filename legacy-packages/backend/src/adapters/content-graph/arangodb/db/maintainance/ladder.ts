import { resolve } from 'path'
import { require_all_updaters } from '../../../../../lib/helpers/arango/migrate/helpers'

export default require_all_updaters({ dirname: resolve(__dirname, 'versionSteps') })
