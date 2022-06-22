export const searchNpmPackages = async (text: string) => {
  const endpoint = `https://registry.npmjs.org/-/v1/search?text=${text}`
  const res = await fetch(endpoint)
  return await res.json()
}

export const getReadmeFromRepo = async (text: string) => {
  console.log(text)
  const endpoint = text.replace('tree', 'raw').concat('/README.md')
  console.log(endpoint)
  const res = await fetch(endpoint, {
    mode: 'no-cors',
  })
  console.log(res)
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
  return 'hsla(' + 360 * number + ',' + (25 + 60 * number) + '%,' + (45 + 1 * number) + '%, ' + opacity + ')'
}
