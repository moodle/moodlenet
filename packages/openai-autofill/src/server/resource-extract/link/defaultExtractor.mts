import { fromBufferWithName } from '@nosferatu500/textract'
import _ogs from 'open-graph-scraper'
import puppeteer from 'puppeteer'
import { promisify } from 'util'
import type { ResourceExtraction } from '../types.mjs'
import { urlToRpcFile } from '../util.mjs'
import type { LinkExtractor } from './types.mjs'

const ogs = _ogs as any as typeof _ogs.default

const defaultLinkExtractor: LinkExtractor = async ({ linkUrl }) => {
  const [puppeteer, og] = await Promise.all([puppeteerScrape(linkUrl), openGraphScrape(linkUrl)])
  return {
    title: og?.title ?? puppeteer?.title,
    content: og?.content ?? puppeteer?.content,
    provideImage: og?.provideImage ?? puppeteer?.provideImage,
    type: 'link to a web page',
    contentDesc: 'web page',
  }
}

async function openGraphScrape(
  url: string,
): Promise<null | Pick<ResourceExtraction, 'provideImage' | 'content' | 'title'>> {
  try {
    const { error, result } = await ogs({ url, downloadLimit: 5_000_000 })
    if (error || !result.ogDescription) {
      return null
    }
    const imageUrl = getImageUrl(result.ogImage)
    const provideImage = imageUrl ? await urlToRpcFile(imageUrl) : undefined
    return {
      title: result.ogTitle,
      content: `${result.ogDescription}
    ${result.ogLocale ? `locale:${result.ogLocale}` : ''}
    `,

      provideImage,
    }
  } catch {
    return null
  }
}
export default defaultLinkExtractor

function getImageUrl(
  ogImage?:
    | string
    | {
        url: string
      }
    | {
        url: string
      }[]
    | undefined,
) {
  if (typeof ogImage === 'string') {
    return ogImage
  } else if (Array.isArray(ogImage)) {
    return ogImage[0]?.url
  } else if (ogImage) {
    return ogImage.url
  } else {
    return undefined
  }
}

async function puppeteerScrape(
  url: string,
): Promise<null | Pick<ResourceExtraction, 'provideImage' | 'title' | 'content'>> {
  try {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    const title = await page.title()
    page.emulateMediaType('screen')
    await page.goto(url, {})
    await new Promise(r => setTimeout(r, 5000))
    const pdfBuffer = await page.pdf({ /* path: 'page.pdf', */ format: 'A4' })
    const quasiName = url.split('/').reverse().slice(0, 1).join('') + '.pdf'
    const content = await promisify<string, Buffer, string>(fromBufferWithName)(
      quasiName,
      pdfBuffer,
    )

    await browser.close()
    return { title, content, provideImage: undefined }
  } catch {
    return null
  }
}
