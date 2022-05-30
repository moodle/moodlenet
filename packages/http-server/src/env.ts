const rootPath = process.env.MN_HTTP_ROOT_PATH ?? '/'
const port = parseInt(process.env.MN_HTTP_PORT ?? '8080')

export default { rootPath, port }
