import { assertRpcFileReadable } from '@moodlenet/core'
import { env } from '../../../init/env.mjs'
import openAiClient from '../../../openai-client.mjs'
import { imageResizer, streamToBuffer } from '../../util.mjs'
import defaultExtractor from '../defaultExtractor.mjs'
import type { FileExtractor } from '../types.mjs'

const imageExtractor: FileExtractor = async ({ rpcFile }) => {
  const { format, resized } = await imageResizer(await assertRpcFileReadable(rpcFile), 1024 * 1024)
  if (!resized) {
    return null
  }
  const defaultExtraction = await defaultExtractor({ rpcFile })
  const extractedText = [defaultExtraction?.title ?? '', defaultExtraction?.content ?? '']
    .join('\n')
    .trim()
  const extractedTextPrompts = extractedText
    ? ({
        type: 'text',
        text: `the following text as been extracted from the image, use this text to help analyze the image content:
${extractedText}`,
      } as const)
    : null

  const base64encodedImage = (await streamToBuffer(resized)).toString('base64')
  const base64encodedImageUrl = `data:image/${format};base64,${base64encodedImage}`
  const chatCompletion = await openAiClient.chat.completions.create(
    {
      ...env.generationConfigs.imageAnalysis.params,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `I will provide you an image, meant to be used as an educational resource.`,
            },
            ...(extractedTextPrompts ? [extractedTextPrompts] : []),
            {
              type: 'text',
              text: `analyze the image content, then provide an extensive description capturing subjects and topics.`,
            },
            {
              type: 'text',
              text: `here's the educational image`,
            },
            {
              type: 'image_url',
              image_url: {
                url: base64encodedImageUrl,
              },
            },
          ],
        },
      ],
      // max_tokens: 300,
    },
    {
      ...env.generationConfigs.imageAnalysis.options,
    },
  )
  const aiContent = chatCompletion?.choices[0]?.message.content
  return {
    title: defaultExtraction?.title,
    content: aiContent ?? defaultExtraction?.content,
    type: `Image`,
    contentDesc: `image description`,
    provideImage: undefined,
  }
}
export default imageExtractor
