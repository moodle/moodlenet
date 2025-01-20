import { assertRpcFileReadable } from '@moodlenet/core'
import { env } from '../../../init/env'
import openAiClient from '../../../openai-client'
import { imageResizer, streamToBuffer } from '../../util'
import defaultIngestor from '../defaultIngestor'
import type { FileIngestor } from '../types'

const imageIngestor: FileIngestor = async ({ rpcFile }) => {
  const { format, resized } = await imageResizer(await assertRpcFileReadable(rpcFile), 1024 * 1024)
  if (!resized) {
    return null
  }
  const defaultIngestion = await defaultIngestor({ rpcFile })
  const ingestedText = [defaultIngestion?.title ?? '', defaultIngestion?.content ?? ''].join('\n').trim()
  const ingestedTextPrompts = ingestedText
    ? ({
        type: 'text',
        text: `the following text as been ingested from the image, use this text to help analyze the image content:
${ingestedText}`,
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
            ...(ingestedTextPrompts ? [ingestedTextPrompts] : []),
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
    title: defaultIngestion?.title,
    content: aiContent ?? defaultIngestion?.content,
    type: `Image`,
    contentDesc: `image description`,
    provideImage: undefined,
  }
}
export default imageIngestor
