import { shell } from '../shell.mjs'

export const env = await getEnv()

// console.log(inspect({ pr: env.keyLikes.private, pu: env.keyLikes.public }, true, 10, true))
type Env = {
  keys: {
    alg: string
    type: string
    private: string
    public: string
  }
}

async function getEnv(): Promise<Env> {
  //FIXME: validate configs
  const env: Env = {
    keys: shell.config.keys,
  }

  return env
}
