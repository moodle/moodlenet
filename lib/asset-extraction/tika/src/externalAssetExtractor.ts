import { url_string, url_string_schema } from '@moodle/lib-types'
import { extractionOutcome, resourceExtractionResult } from '@moodle/module/resource-extraction'
import { externalAsset } from '@moodle/module/storage'
import ogs from 'open-graph-scraper'
import puppeteer from 'puppeteer'
import { tikaExtract } from './tikaExtract'
// import { urlToLocalAsset } from '../util'

// import _ogs from 'open-graph-scraper'
// const ogs = _ogs as any as typeof _ogs.default

async function externalAssetExtractor({
  asset,
  tikaUrl,
}: {
  asset: externalAsset
  tikaUrl: string
}): Promise<extractionOutcome> {
  const [fromPuppeteer, fromOgs] = await Promise.all([puppeteerScrape({ url: asset.url }), openGraphScrape(asset.url)])
  if (!(fromPuppeteer || fromOgs)) {
    return [false, { reason: 'couldNotExtract' }]
  }
  const content = fromOgs?.content
    ? fromOgs.content
    : fromPuppeteer
      ? await tikaExtract({ tikaUrl, body: fromPuppeteer.pdf, mimeType: 'application/pdf' })
      : null

  return [
    true,
    {
      title: fromOgs?.title ?? fromPuppeteer?.title ?? null,
      content,
      image: fromOgs?.image ?? null,
      extractionKind: 'web page',
    },
  ]
}

async function openGraphScrape(
  url: url_string,
): Promise<null | Pick<resourceExtractionResult, 'image' | 'content' | 'title'>> {
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
export default externalAssetExtractor

async function puppeteerScrape({ url }: { url: string }) {
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const title = await page.title()
    page.emulateMediaType('screen')
    await page.goto(url, {})
    await new Promise(r => setTimeout(r, 5000))
    const pdf = await page.pdf({ /* path: 'page.pdf', */ format: 'A4' })
    // const htmlContent = (await page.evaluate('() => document.documentElement.outerHTML')) as string

    await browser.close()
    return { title, pdf }
  } catch {
    return null
  }
}
