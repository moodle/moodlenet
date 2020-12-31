import { resolve } from 'path'
import * as Yup from 'yup'
import { once } from '../../../lib/helpers/misc'
import { ContentGraphEngine } from './persistence/types'

const PERSISTENCE_IMPL = process.env.CONTENT_GRAPH_PERSISTENCE_IMPL

export const getContentGraphEngine = once(
  async (): Promise<ContentGraphEngine> => {
    const persistenceModule = Yup.string()
      .required()
      .default('arango')
      .validateSync(PERSISTENCE_IMPL)
    return require(resolve(__dirname, 'persistence', 'impl', persistenceModule))
  }
)
