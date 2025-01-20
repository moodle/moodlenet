import { ok_ko, url_string, url_string_schema } from '@moodle/lib-types'
import { eduResourceIngestionOutcome as ingestionOutcome } from '@moodle/module/resource-ingestion'
import { asset, externalAsset } from '@moodle/module/storage'
import ogs from 'open-graph-scraper'

// NOTICE: Dropped use of puppeteer because its content outcome is always messy, containing a lot of noise from html page

const ingestionImpl = 'ogsUrlIngestor'
export async function ogsUrlIngestor({ url }: { url: url_string }): Promise<ingestionOutcome> {
  const [ogsDone, ogsResponse] = await openGraphScrape({ url })
  if (!ogsDone) {
    return { outcome: 'undoable', details: { ogsResponse }, ingestionImpl, reason: 'could not get any' }
  }
  const content = ogsResponse.content
  const title = ogsResponse.title

  const image: asset | null = ogsResponse.image ? { type: 'external', ...ogsResponse.image } : null
  return { outcome: 'succeed', title, content, image, ingestionImpl: 'puppeteer+open-graph-scraper+tika' }
}

async function openGraphScrape({ url }: { url: url_string }): Promise<
  ok_ko<
    {
      title: string | null
      content: string
      image: externalAsset | null
    },
    { error: { error: unknown }; couldNotGet: unknown }
  >
> {
  try {
    const { error, result } = await ogs({
      url,
      onlyGetOpenGraphInfo: ['image', 'title', 'description', 'locale'],
      timeout: 10000,
    })
    if (error) {
      return [false, { reason: 'couldNotGet' }]
    }
    const imageUrl = await url_string_schema.parseAsync(result.ogImage?.[0]?.url).catch(() => null)
    const image: externalAsset | null = imageUrl && {
      url: imageUrl,
      credits: {
        owner: { url, name: result.ogSiteName ?? new URL(url).hostname },
        provider: { url, name: new URL(url).hostname },
      },
    }
    const ogsResult = {
      title: result.ogTitle ?? null,
      content: `${result.ogDescription ? `${result.ogDescription}\n` : ''}${result.ogLocale ? `locale:${result.ogLocale}` : ''}`,
      image,
    }
    return [true, ogsResult]
  } catch (error) {
    return [false, { reason: 'error', error }]
  }
}
