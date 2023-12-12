import openAiClient from '../../../openai-client.mjs'
import { imageResizer, streamToBuffer } from '../../util.mjs'
import defaultExtractor from '../defaultExtractor.mjs'
import type { FileExtractor } from '../types.mjs'

const imageExtractor: FileExtractor = async feArgs => {
  const { readable } = feArgs
  const { meta, resized } = await imageResizer(readable, 1024 * 1024)
  if (!resized) {
    return null
  }
  const defaultExtraction = await defaultExtractor(feArgs)
  const extractedTextPrompts = defaultExtraction?.text
    ? ([
        {
          type: 'text',
          text: `the following text as been extracted from the image`,
        },
        {
          type: 'text',
          text: defaultExtraction.text,
        },
      ] as const)
    : []

  const base64Image = (await streamToBuffer(resized)).toString('base64')
  const base64ImageUrl = `data:image/${meta.format};base64,${base64Image}`
  const chatCompletion = await openAiClient.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `I will provide you an image, meant to be used as an educational resource.`,
          },
          ...extractedTextPrompts,
          {
            type: 'text',
            text: `analyze the image content, then provide an extensive description capturing subjects and topics${
              extractedTextPrompts.length ? '(you can use the extracted text)' : ''
            }.`,
          },
          {
            type: 'text',
            text: `here's the educational image`,
          },
          {
            type: 'image_url',
            image_url: {
              url: base64ImageUrl,
            },
          },
        ],
      },
    ],
    // max_tokens: 300,
  })
  const text = chatCompletion?.choices[0]?.message.content
  if (!text) {
    return null
  }
  return {
    text,
    type: `Image`,
    contentDesc: `image description`,
    provideImage: undefined,
  }
}
export default imageExtractor
