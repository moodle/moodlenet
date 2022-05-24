import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
const MN_DOTENV_PATH = process.env.MN_DOTENV_PATH
try {
  const base_env = dotenv.config({
    path: MN_DOTENV_PATH,
    debug: true,
  })
  expand(base_env)
} catch (error) {
  console.warn(`dotenv error - envExpand:`, error)
}
