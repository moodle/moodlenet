import { ingestor } from '../types'
import mbzIngestor from './ext/mbz'
const extensionSpecificIngestors: Record<string, ingestor<'readable'>> = {
  mbz: mbzIngestor,
}
export default extensionSpecificIngestors
