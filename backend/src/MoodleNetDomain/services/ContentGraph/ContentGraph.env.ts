import { resolve } from 'path'
import * as Yup from 'yup'
import { once } from '../../../lib/helpers/misc'
import { ContentGraphPersistence } from './persistence/types'

const PERSISTENCE_IMPL = process.env.CONTENT_GRAPH_PERSISTENCE_IMPL

export const getContentGraphPersistence = once(
  async (): Promise<ContentGraphPersistence> => {
    const persistenceModule = Yup.string()
      .required()
      .default('arango')
      .validateSync(PERSISTENCE_IMPL)
    return require(resolve(__dirname, 'persistence', 'impl', persistenceModule))
  }
)
