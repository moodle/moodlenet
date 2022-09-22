import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
try {
  const base_env = dotenv.config({
    path: process.env.MN_DOTENV_PATH, //?? process.cwd(),
    debug: true,
  })
  expand(base_env)
} catch (error) {
  console.warn(`
    dotenv error:
    ${error}
    ... will use native process.env`)
}
