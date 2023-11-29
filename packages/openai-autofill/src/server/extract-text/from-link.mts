import puppeteer from 'puppeteer'
import { fromBufferWithName } from 'textract'
import { promisify } from 'util'

export async function extractTextFromLink(url: string): Promise<{ text: string }> {
  const { text } = await scrape(url)
  return { text }
}

async function scrape(url: string) {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  page.emulateMediaType('screen')
  await page.goto(url)
  const pdfBuffer = await page.pdf({ path: 'page.pdf', format: 'A4' })
  console.log(pdfBuffer.toString())
  const quasiName = url.split('/').reverse().slice(0, 1).join('') + '.pdf'
  const text = await promisify<string, Buffer, string>(fromBufferWithName)(quasiName, pdfBuffer)

  await browser.close()
  return { text }
}
