import { fromBufferWithName } from '@nosferatu500/textract'
import puppeteer from 'puppeteer'
import { promisify } from 'util'
import type { ResourceTextAndDesc } from './types.mjs'

export async function extractTextFromLink(url: string): Promise<ResourceTextAndDesc> {
  const resourceTextAndDesc = await scrape(url)
  return resourceTextAndDesc
}

async function scrape(url: string): Promise<ResourceTextAndDesc> {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  page.emulateMediaType('screen')
  await page.goto(url, {})
  await new Promise(r => setTimeout(r, 5000))
  const pdfBuffer = await page.pdf({ path: 'page.pdf', format: 'A4' })
  const quasiName = url.split('/').reverse().slice(0, 1).join('') + '.pdf'
  const text = await promisify<string, Buffer, string>(fromBufferWithName)(quasiName, pdfBuffer)

  await browser.close()
  return { text, type: 'link to a web page', contentDesc: 'web page' }
}
