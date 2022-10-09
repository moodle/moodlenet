import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import { resolve } from 'path'

export const IS_LOCAL_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const DOTENV_PATH = process.env.MOODLENET_CORE_DOTENV_PATH ?? process.cwd()
const base_env = dotenv.config({
  path: DOTENV_PATH,
  debug: true,
})
expand(base_env)

export const WORKING_DIR = resolve(process.cwd(), process.env.MOODLENET_CORE_WORKING_DIR ?? '.')
