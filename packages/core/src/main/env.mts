import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import { resolve } from 'path'

export const DOTENV_PATH = process.env.MOODLENET_CORE_DOTENV_PATH ?? process.cwd()
const base_env = dotenv.config({
  path: DOTENV_PATH,
  debug: true,
})
expand(base_env)

export const WORKING_DIR = resolve(process.cwd(), process.env.MOODLENET_CORE_WORKING_DIR ?? '.')
export const SYSTEM_DIR = resolve(WORKING_DIR, process.env.MOODLENET_CORE_SYSTEM_DIR ?? 'system')
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
