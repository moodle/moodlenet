import { defaultIngestor } from './default-ingestor'
import extensionSpecificIngestors from './fileExtensionSpecificIngestors'
import typeSpecificIngestor from './mimetypeSpecificIngestors'
import { ingestor } from './types'

export const ingestReadable: ingestor<'readable'> = async ({ object, env }) => {
  const ext = (object.name.split('.').pop() ?? '').toLowerCase()

  const typeKind = (object.mimetype.split('/').shift() ?? '').toLowerCase()

  const ingestor = extensionSpecificIngestors[ext] ?? typeSpecificIngestor[typeKind] ?? defaultIngestor

  return ingestor({ object, env })
}
