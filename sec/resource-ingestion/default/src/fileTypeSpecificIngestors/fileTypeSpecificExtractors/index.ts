import { assetIngestor } from '../types'
const typeSpecificIngestor: Record<string, assetIngestor<'stored'>> = {}
export default typeSpecificIngestor
