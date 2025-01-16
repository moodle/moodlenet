import { ok_ko, url_string, url_string_schema } from '@moodle/lib-types'
import { eduResourceIngestionOutcome as ingestionOutcome } from '@moodle/module/resource-ingestion'
import { asset, externalAsset } from '@moodle/module/storage'
import ogs from 'open-graph-scraper'
import puppeteer from 'puppeteer'
import * as timers from 'timers/promises'
import { tikaIngestion__gets__only__content } from './tika-ingestor__gets__only__content'
// import { urlToLocalAsset } from '../util'

// import _ogs from 'open-graph-scraper'
// const ogs = _ogs as any as typeof _ogs.default

const ingestionImpl = 'puppeteerOgsUrlIngestor'
export async function puppeteerOgsUrlIngestor({
  url,
  tikaServerUrl,
}: {
  url: url_string
  tikaServerUrl: string
}): Promise<ingestionOutcome> {
  const [[puppeteerDone, puppeteerResponse], [ogsDone, ogsResponse]] = await Promise.all([
    puppeteerScrape({ url }),
    openGraphScrape({ url }),
  ])
  if (!(puppeteerDone || ogsDone)) {
    return { outcome: 'undoable', details: { puppeteerResponse, ogsResponse }, ingestionImpl, reason: 'could not get any' }
  }
  const content =
    ((ogsDone && ogsResponse.content) || '') +
      ((puppeteerDone && (await tikaUrlContentIngestion({ tikaServerUrl, ...puppeteerResponse }))) || '') || null

  const title = (ogsDone && ogsResponse.title) || (puppeteerDone && puppeteerResponse.title) || null
  const externalAssetImage = (ogsDone && ogsResponse.image) || null

  const image: asset | null = externalAssetImage ? { type: 'external', ...externalAssetImage } : null
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

async function puppeteerScrape({ url }: { url: string }): Promise<
  ok_ko<
    {
      title: string
      pdf: Uint8Array
      htmlContent: string | null
    },
    { error: { error: unknown } }
  >
> {
  try {
    // SECURITY: was getting the following error from puppeteer.launch:
    // FIXME
    //
    //        puppeteerScrape Error Error: Failed to launch the browser process!
    //        [191475:191475:0116/152906.889005:FATAL:zygote_host_impl_linux.cc(128)]
    //        No usable sandbox! If you are running on Ubuntu 23.10+
    //        or another Linux distro that has disabled unprivileged user namespaces with AppArmor,
    //        see https://chromium.googlesource.com/chromium/src/+/main/docs/security/apparmor-userns-restrictions.md.
    //        Otherwise see https://chromium.googlesource.com/chromium/src/+/main/docs/linux/suid_sandbox_development.md
    //        for more information on developing with the (older) SUID sandbox.
    //        If you want to live dangerously and need an immediate workaround, you can try using --no-sandbox.
    //
    // added `args: ['--no-sandbox', '--disable-setuid-sandbox']` but not sure about security implications
    // https://stackoverflow.com/a/62348133/1455910

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    const title = await page.title()
    page.emulateMediaType('screen')
    await page.goto(url, {})
    await timers.setTimeout(5000)
    const pdf = await page.pdf({ /* path: 'page.pdf', */ format: 'A4' })
    const _mHtmlContent = await page.evaluate('() => document.documentElement.outerHTML')
    const htmlContent = typeof _mHtmlContent === 'string' ? _mHtmlContent : null
    await browser.close()
    const puppeteerResult = { title, pdf, htmlContent }
    return [true, puppeteerResult]
  } catch (error) {
    console.error('puppeteerScrape Error', error)
    return [false, { reason: 'error', error }]
  }
}

async function tikaUrlContentIngestion({
  tikaServerUrl,
  htmlContent,
  pdf,
}: {
  tikaServerUrl: string
  pdf: Uint8Array
  htmlContent: string | null
}): Promise<string | null> {
  const pdfIngestion = await tikaIngestion__gets__only__content({ tikaServerUrl, body: pdf, mimeType: 'application/pdf' })
  if (pdfIngestion.outcome === 'succeed') {
    return pdfIngestion.content
  }
  if (htmlContent === null) {
    return null
  }
  const htmlIngestion = await tikaIngestion__gets__only__content({ tikaServerUrl, body: htmlContent, mimeType: 'text/html' })
  return htmlIngestion.outcome === 'succeed' ? htmlIngestion.content : null
}
