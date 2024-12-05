import { assetExtractor } from '../types'
import mbzExtractor from './ext/mbz'
const extensionSpecificExtractors: Record<string, assetExtractor<'local'>> = {
  mbz: mbzExtractor,
}
export default extensionSpecificExtractors
