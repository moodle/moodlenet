import { http } from '@moodle/bindings/node'
import { coreDomain, dispatch, MoodleDomain } from '@moodle/domain'
http.server({
  port: 8100,
  baseUrl: '/',
  access({ domain_msg, meta }) {
    const domain = coreDomain({ domain: meta as MoodleDomain })
    return dispatch(domain, domain_msg)
  },
})
