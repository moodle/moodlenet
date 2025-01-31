import * as moo from 'moodle-domain'
import { Anonymous_EmailSignup_RequestSignupWithMyEmail_apply } from './requestSignupWithMyEmail/anonymous.emailSignup.requestSignupWithMyEmail.apply'
import { Anonymous_EmailSignup_RequestSignupWithMyEmail_confirmMyEmailAndSignup } from './requestSignupWithMyEmail/anonymous.emailSignup.requestSignupWithMyEmail.confirmMyEmail'

export type Anonymous_EmailSignup = moo.DefSystemAccess<{
  useCase: {
    requestSignupWithMyEmail: {
      apply: Anonymous_EmailSignup_RequestSignupWithMyEmail_apply
      confirmMyEmailAndSignup: Anonymous_EmailSignup_RequestSignupWithMyEmail_confirmMyEmailAndSignup
    }
  }
}>
