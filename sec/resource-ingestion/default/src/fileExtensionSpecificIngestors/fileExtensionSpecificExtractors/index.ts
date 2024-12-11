import { assetIngestor } from '../types'
import mbzIngestor from './ext/mbz'
const extensionSpecificIngestors: Record<string, assetIngestor<'stored'>> = {
  mbz: mbzIngestor,
}
export default extensionSpecificIngestors
