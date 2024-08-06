import type { EmailOrganizationProps } from '@moodlenet/component-library/email-templates'
const currentYear = new Date().getFullYear()

export const defaultEmailOrganization: EmailOrganizationProps = {
  logoOnClickUrl: 'http://moodle.com',
  logoSrc: 'https://i.ibb.co/cDZ97rk/Moodle-Net-Logo-Colour-RGB.png',
  name: 'MoodleNet',
  location: {
    address: 'PO Box 303, West Perth WA 6872, Australia',
    url: 'https://www.google.com/maps/place/Moodle/@-31.9489919,115.8403923,15z/data=!4m5!3m4!1s0x0:0x2bff7bedf43b4fc7!8m2!3d-31.9489919!4d115.8403923',
  },
  copyright: `Copyright © ${currentYear} Moodle Pty Ltd, All rights reserved.`,
}
