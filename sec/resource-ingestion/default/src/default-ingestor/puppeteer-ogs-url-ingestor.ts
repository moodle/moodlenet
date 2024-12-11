import { url_string, url_string_schema } from '@moodle/lib-types'
import { ingestionOutcome } from '@moodle/module/resource-ingestion'
import ogs from 'open-graph-scraper'
import puppeteer from 'puppeteer'
import { tikaIngestor } from './tika-ingestor'
// import { urlToLocalAsset } from '../util'

// import _ogs from 'open-graph-scraper'
// const ogs = _ogs as any as typeof _ogs.default

export async function puppeteerOgsUrlIngestor({
  url,
  tikaUrl,
}: {
  url: url_string
  tikaUrl: string
}): Promise<ingestionOutcome> {
  const [fromPuppeteer, fromOgs] = await Promise.all([puppeteerScrape({ url }), openGraphScrape({ url })])
  if (!(fromPuppeteer || fromOgs)) {
    return [false, { reason: 'couldNotIngest' }]
  }
  const content = fromOgs?.content
    ? fromOgs.content
    : fromPuppeteer
      ? await tikaIngestor({ tikaUrl, body: fromPuppeteer.pdf, mimeType: 'application/pdf' })
      : null

  return [
    true,
    {
      title: fromOgs?.title ?? fromPuppeteer?.title ?? null,
      content,
      image: fromOgs?.image ?? null,
      ingestionKind: 'web page',
    },
  ]
}

async function openGraphScrape({ url }: { url: url_string }): Promise<ingestionOutcome> {
  try {
    const { error, result } = await ogs({
      url,
      onlyGetOpenGraphInfo: ['image', 'title', 'description', 'locale'],
      timeout: 10000,
    })
    if (error) {
      return null
    }
    const imageUrl = await url_string_schema.parseAsync(result.ogImage?.[0]?.url).catch(() => null)
    return {
      title: result.ogTitle ?? null,
      content: `${result.ogDescription ? `${result.ogDescription}\n` : ''}${result.ogLocale ? `locale:${result.ogLocale}` : ''}`,
      image: imageUrl && {
        type: 'external',
        url: imageUrl,
        credits: { owner: { url, name: result.ogSiteName ?? new URL(url).hostname } },
      },
    }
  } catch {
    return null
  }
}

async function puppeteerScrape({ url }: { url: string }) {
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const title = await page.title()
    page.emulateMediaType('screen')
    await page.goto(url, {})
    await new Promise(r => setTimeout(r, 5000))
    const pdf = await page.pdf({ /* path: 'page.pdf', */ format: 'A4' })
    const htmlContent = (await page.evaluate('() => document.documentElement.outerHTML')) as string

    await browser.close()
    return { title, pdf, htmlContent }
  } catch {
    return null
  }
}
