import { ingestor } from '../types'
const mimetypeSpecificIngestors: Record<string, ingestor<'readable'>> = {}
export default mimetypeSpecificIngestors
