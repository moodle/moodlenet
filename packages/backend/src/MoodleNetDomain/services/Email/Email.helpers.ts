import dot from 'dot'

export const fillEmailToken = (_: { emailString: string; token: string }) => {
  const { emailString, token } = _
  return dot.compile(emailString)({ token })
}
