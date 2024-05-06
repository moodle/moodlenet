import { Button } from '@react-email/button'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Html } from '@react-email/html'
import { Img } from '@react-email/img'
import { Preview } from '@react-email/preview'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'
import type React from 'react'

export type EmailLayoutProps = {
  subject: string
  receiverEmail: string
  title: React.ReactNode
  content: React.ReactNode
  logoSrc?: string
  logoOnClickUrl: string
  actionTitle?: string
  actionUrl?: string
  actionButtonStyle?: React.CSSProperties
  location?: string
  locationUrl?: string
  copyright?: string
}

export const EmailLayout = ({
  title,
  receiverEmail,
  content,
  subject,
  logoSrc,
  logoOnClickUrl,
  actionTitle,
  actionUrl,
  actionButtonStyle,
  location,
  locationUrl,
  copyright,
}: EmailLayoutProps) => {
  return (
    <Html lang="en" className="html">
      <Head />
      <Preview>{subject}</Preview>
      <div className="body" style={bodyStyle}>
        <Container className="container" style={containerStyle}>
          <Section className="logo-header" style={logo}>
            <a href={logoOnClickUrl} target="_blank">
              <Img width={162} src={logoSrc} />
            </a>
          </Section>
          <Section className="title" style={titleSection}>
            <Text style={titleText}>{title}</Text>
          </Section>
          <Section className="content" style={contentSection}>
            <div style={contentText}>{content}</div>
          </Section>
          {actionTitle && (
            <Section className="action" style={{ ...actionSection }}>
              <Button
                className="action-button"
                href={actionUrl}
                target="_blank"
                style={{ ...actionButton, ...actionButtonStyle }}
              >
                {actionTitle}
              </Button>
            </Section>
          )}
          <div style={ignoreMessage}>Not you? Just ignore this message</div>
        </Container>
        <Container style={containerBottom}>
          <a href={locationUrl} target="_blank" rel="noopener noreferrer" style={addressButton}>
            {location}
          </a>
          <div style={copyrightStyle}>
            {copyright}
            <br />
            This email was intended for {receiverEmail}. This is a service email.
          </div>
        </Container>
      </div>
    </Html>
  )
}

const currentYear = new Date().getFullYear()
EmailLayout.defaultProps = {
  subject: 'Email from MoodleNet',
  logoSrc: 'https://i.ibb.co/cDZ97rk/Moodle-Net-Logo-Colour-RGB.png',
  instanceName: 'MoodleNet',
  receiverEmail: 'caterine.z.pons@temail.com',
  logoOnClickUrl: 'http://moodle.com',
  location: 'PO Box 303, West Perth WA 6872, Australia',
  copyright: `Copyright © ${currentYear} Moodle Pty Ltd, All rights reserved.`,
  locationUrl:
    'https://www.google.com/maps/place/Moodle/@-31.9489919,115.8403923,15z/data=!4m5!3m4!1s0x0:0x2bff7bedf43b4fc7!8m2!3d-31.9489919!4d115.8403923',
  title: 'Title goes here',
  content: 'Content goes here',
} as EmailLayoutProps

export default EmailLayout

const bodyStyle = {
  height: '100%',
  backgroundColor: '#f1f1f1',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  paddingTop: '32px',
}

const containerStyle = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  backgroundColor: '#ffffff',
  borderRadius: '8px 8px 0 0',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 48px 16px 48px',
  textAlign: 'center',
}

const containerBottom = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  borderRadius: '0 0 8px 8px',
  backgroundColor: '#f7fafa',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 48px 48px 48px',
}

const logo = {
  display: 'flex',
  justifyContent: 'center',
  alingItems: 'center',
  paddingBottom: '16px',
  // padding: ,
}
const titleSection = {
  textAlign: 'center',
  margin: '14px 0',
}

const titleText = {
  fontSize: '18px',
  fontWeight: 'bold',
}

const contentSection = {
  background: '#f5f5f5',
  padding: '28px',
  color: '#282828',
  borderRadius: '18px',
  boxShadow: '2px 2px #0000003b',
  textAlign: 'center',
}

const contentText = {
  fontSize: '15px',
  lineHeight: '28px',
}

const actionSection = {
  textAlign: 'center',
  margin: '28px 0 48px 0',
}

const actionButton = {
  padding: '14px 20px',
  display: 'inline-block',
  borderRadius: '48px',
  background: '#f88012',
  color: '#ffffff',
  fontSize: '15px',
}

const ignoreMessage = {
  textAlign: 'center',
  color: '#999999',
  fontSize: '12px',
  lineHeight: '150%',
  margin: '10px 0',
  padding: '0',
}

const addressButton = {
  display: 'block',
  cursor: 'pointer',
  textDecoration: 'none',
  textAlign: 'center',
  color: '#17bebb',
  margin: '10px 0',
  padding: '0',
  fontFamily: 'Helvetica',
  fontSize: '12px',
  lineHeight: '150%',
}

const copyrightStyle = {
  margin: '10px 0',
  padding: '0',
  color: '#656565',
  fontFamily: 'Helvetica',
  fontSize: '12px',
  lineHeight: '150%',
  textAlign: 'center',
}
