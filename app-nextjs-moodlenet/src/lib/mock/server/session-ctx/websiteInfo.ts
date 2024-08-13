import { WebsiteInfo } from '@/lib/server/session/types/website'

export async function websiteInfo() {
  const websiteInfo: WebsiteInfo = {
    domain: 'localhost:3000',
    basePath: '/',
    secure: false,
    logo: 'https://moodle.net/08469f8073a8f969253823d5d6ed6ffa.png',
    smallLogo: 'https://moodle.net/e80d311942d3ce22651b33968a87ecb1.png',
    title: 'Search for resources, subjects, collections or people',
    subtitle: 'Find, share and curate open educational resources',
  }
  return websiteInfo
}
