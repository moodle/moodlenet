import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

export const unchecked_env_result = dotenvExpand(dotenv.config())
// TODO: env vars validity check
const env = unchecked_env_result.parsed

export default env
