const STATICASSETS_FS_ROOT_FOLDER = process.env.STATICASSETS_FS_ROOT_FOLDER

if (!STATICASSETS_FS_ROOT_FOLDER) {
  console.error('FS Env:')
  console.error({ STATICASSETS_FS_ROOT_FOLDER })
  throw new Error(`some env missing or invalid`)
}

const fsenv = {
  rootFolder: STATICASSETS_FS_ROOT_FOLDER,
}

export type DBEnv = typeof fsenv

export default fsenv
