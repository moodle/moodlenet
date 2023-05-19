import type { PkgIdentifier, RpcArgs } from '@moodlenet/core'
import { compile } from 'path-to-regexp'
export const BASE_PKG_URL = '/.pkg'

export function getPkgRpcFetchOpts(
  userPkgId: PkgIdentifier,
  targetPkgId: PkgIdentifier,
  apiPath: string,
  args: RpcArgs,
) {
  const [bodyArg, params, query] = args
  const searchParams = new URLSearchParams(query ?? {}).toString()
  const toPath = compile(apiPath, { encode: encodeURIComponent })
  const apiPathWithParams = toPath(params ?? {})
  // const apiPathWithParams = Object.entries(params ?? {}).reduce(
  //   (_restPath, [key, val]) => _restPath.replaceAll(`:${key}`, String(val)),
  //   apiPath,
  // )

  const url = `${BASE_PKG_URL}/${targetPkgId.name}/${apiPathWithParams}${
    searchParams ? `?${searchParams}` : ''
  }`

  const [method, body, contentType] = getRequestBody(bodyArg)
  const requestInit: RequestInit = {
    method,
    headers: {
      ...(contentType ? { 'Content-Type': contentType } : null),
      'Accept': 'application/json',
      'x-moodlenet-react-app-caller': `${userPkgId.name}@${userPkgId.version}`,
    },
    body,
    credentials: 'same-origin',
    redirect: 'error',
    // cache,
  }
  return { url, requestInit }
}

function getRequestBody(bodyArg: RpcArgs[0]): [method: string, body?: any, contentType?: string] {
  const hasBody = !(bodyArg === undefined || bodyArg === null)
  if (!hasBody) {
    return ['GET', undefined, undefined]
  }
  const files = extractBodyFiles(bodyArg)
  if (!files.length) {
    return ['POST', JSON.stringify(bodyArg), 'application/json']
  } else {
    const formData = new FormData()
    formData.append('.', JSON.stringify(bodyArg))
    files.forEach(({ file, propPath }) => formData.append(propPath, file))
    return ['POST', formData, undefined]
  }
}

type BodyFile = { propPath: string; file: File }
function extractBodyFiles(bodyArg: any, basePropPath = ''): BodyFile[] {
  if (!bodyArg) {
    return []
  }
  const bodyEntries = Object.entries(bodyArg)
  const moreFiles = bodyEntries.flatMap(([propName, propVal]) => {
    if (typeof propVal !== 'object') {
      return []
    }
    if (Array.isArray(propVal) && !!propVal.find(propValElem => propValElem instanceof File)) {
      delete bodyArg[propName]
      return propVal.map(file => {
        const bodyFile: BodyFile = {
          file,
          propPath: `${basePropPath}.${propName}`,
        }
        return bodyFile
      })
    }

    return bodyEntries.flatMap(([propName, val]) =>
      extractBodyFiles(val, `${basePropPath}.${propName}`),
    )
  })

  return moreFiles
}
