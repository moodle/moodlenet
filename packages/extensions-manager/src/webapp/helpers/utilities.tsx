export const searchNpmPackages = async (text: string) => {
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
  const corsEndpoint = 'https://@moodlenet/redirect.herokuapp.com/'.concat(endpoint)
  const res = await fetch(corsEndpoint)
  return await res.text()
}

export const capitalize = (s: string) => {
  return s[0] && s[0].toUpperCase() + s.slice(1)
}

export const getNumberFromString = (s: string) => {
  let number = 1

  s.split('').forEach(l => {
    number = number * l.charCodeAt(0)
  })

  return number
}

export const getPastelColor = (i?: number, opacity = 1) => {
  const number = i ? parseFloat('0.' + i.toString().slice(0, 5).replace('.', '')) : Math.random()
  return 'hsla(' + 360 * number + ',' + '75%,' + '50%, ' + opacity + ')'
  // return 'hsla(' + 360 * number + ',' + (25 + 60 * number) + '%,' + (45 + 1 * number) + '%, ' + opacity + ')'
}
