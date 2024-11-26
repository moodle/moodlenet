import type { RequestOptions } from 'openai/core.mjs'
import type { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat/completions.mjs'
import type { ImageGenerateParams } from 'openai/resources/images.mjs'
import { shell } from '../shell.mjs'

export const env = getEnv()
type Env = {
  tikaUrl: string
  apiKey: string
  cutContentToCharsAmount: number
  noBgProc: boolean
  generationConfigs: {
    image: {
      params: ImageGenerateParams
      options?: RequestOptions
    }
    metadata: {
      params: ChatCompletionCreateParamsNonStreaming
      options?: RequestOptions
    }
    imageAnalysis: {
      params: ChatCompletionCreateParamsNonStreaming
      options?: RequestOptions
    }
  }
}
function getEnv(): Env {
  const config = shell.config
  const env: Env = {
    tikaUrl: String(config.tikaUrl),
    apiKey: config.apiKey,
    cutContentToCharsAmount: Number(config.cutContentToCharsAmount ?? 20_000),
    noBgProc: config.noBgProc === true,
    generationConfigs: {
      image: {
        params: {
          size: '1024x1024',
          style: 'natural',
          ...(config.generationConfigs?.image?.params ?? {}),
          n: 1,
        },
        options: {
          ...(config.generationConfigs?.image?.options ?? {}),
        },
      },
      metadata: {
        params: {
          temperature: 0.0,
          ...(config.generationConfigs?.metadata?.params ?? {}),
          stream: false,
          n: 1,
        },
        options: {
          ...(config.generationConfigs?.metadata?.options ?? {}),
          stream: false,
        },
      },
      imageAnalysis: {
        params: {
          temperature: 0.0,
          ...(config.generationConfigs?.imageAnalysis?.params ?? {}),
          stream: false,
          n: 1,
        },
        options: {
          ...(config.generationConfigs?.imageAnalysis?.options ?? {}),
          stream: false,
        },
      },
    },
  }

  return env
}
