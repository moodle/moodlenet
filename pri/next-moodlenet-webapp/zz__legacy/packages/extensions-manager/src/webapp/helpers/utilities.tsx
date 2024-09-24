export const searchNpmPackages = async (text: string) => {
  // FIXME!!: get npmRegistry from server
  const endpoint = `https://registry.npmjs.org/-/v1/search?text=${text}`
  const res = await fetch(endpoint)
  return await res.json()
}

export function splitPkgName(packageName: string) {
  const [pkgName, _at_scope] = packageName.split('/').reverse() as [name: string, scope?: string]
  const scope = _at_scope?.startsWith('@') ? _at_scope.substring(1) : _at_scope
  return [pkgName, scope] as const
}

export const getReadmeFromRepo = async (endpoint: string) => {
  if (endpoint.includes('tree')) {
    endpoint = endpoint.replace('tree', 'raw').concat('/README.md')
  } else if (endpoint.includes('#readme')) {
    endpoint = endpoint.replace('#readme', '/-/raw/master/README.md')
  }
  // FIXME!!: herokuapp ?!
  const corsEndpoint = 'https://@moodlenet/redirect.herokuapp.com/'.concat(endpoint)
  const res = await fetch(corsEndpoint)
  return await res.text()
}

export const capitalize = (s: string) => {
  return s[0] && s[0].toUpperCase() + s.slice(1)
}
