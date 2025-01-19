import { ingestor } from '../types'
import { ogsUrlIngestor } from './ogs-url-ingestor'
import { tikaIngestion__gets__only__content } from './tika-ingestor__gets__only__content'

export const defaultIngestor: ingestor = async ({ env, object }) => {
  if (object.type === 'url') {
    return ogsUrlIngestor({ url: object.url })
  }

  const tikaIngestion = await tikaIngestion__gets__only__content({
    tikaServerUrl: env.tikaServerUrl,
    body: object.readable,
    mimeType: object.mimetype,
  })
  if (tikaIngestion.outcome === 'undoable') {
    return tikaIngestion
  }
  return {
    outcome: 'succeed',
    title: object.name,
    content: tikaIngestion.content,
    image: null,
    ingestionImpl: tikaIngestion.ingestionImpl,
  }
}
