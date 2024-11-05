export function post_to_url(path: string, method = 'POST', params?: Record<string, any>) {
  const form = document.createElement('form')
  form.setAttribute('method', method)
  form.setAttribute('action', path)

  for (const key in params) {
    const hiddenField = document.createElement('input')
    hiddenField.setAttribute('type', 'hidden')
    hiddenField.setAttribute('name', key)
    hiddenField.setAttribute('value', params[key])

    form.appendChild(hiddenField)
  }

  document.body.appendChild(form)
  form.submit()
}
