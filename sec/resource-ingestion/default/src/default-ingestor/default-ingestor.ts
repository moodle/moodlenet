import { ingestor } from '../types'
import { puppeteerOgsUrlIngestor } from './puppeteer-ogs-url-ingestor'
import { tikaIngestion__gets__only__content } from './tika-ingestor__gets__only__content'

export const defaultIngestor: ingestor = async ({ env, object }) => {
  if (object.type === 'url') {
    return puppeteerOgsUrlIngestor({ url: object.url, tikaServerUrl: env.tikaServerUrl })
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
