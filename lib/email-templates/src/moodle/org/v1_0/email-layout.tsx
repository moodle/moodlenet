'use client'
import { CoreContext } from '@moodle/lib-ddd'
import { url_string } from '@moodle/lib-types'
import { Button } from '@react-email/button'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Html } from '@react-email/html'
import { Img } from '@react-email/img'
import { Preview } from '@react-email/preview'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'
import React from 'react'

export interface SenderInfo {
  name: string
  logo: url_string
  physicalAddress: null | string
  websiteUrl: url_string
  copyright: null | string
  // smallLogo: url_string
  // emailAddress: null | email_address
}

export type EmailLayoutActionBtnProps = {
  title: string
  url: string
  buttonStyle?: React.CSSProperties
}

export type EmailLayoutContentProps = {
  receiverEmail: string
  subject: string
  title: React.ReactNode
  body: React.ReactNode
  hideIgnoreMessage: boolean | undefined
  action?: EmailLayoutActionBtnProps
}
export type EmailLayoutProps = {
  senderInfo: SenderInfo
  content: EmailLayoutContentProps
}

export function layoutEmail(emailProps: EmailLayoutProps) {
  const { senderInfo, content } = emailProps
  return {
    emailProps,
    reactBody: (
      <Html lang="en" className="html">
        <Head />
        <Preview>{content.subject}</Preview>
        <div className="body" style={bodyStyle}>
          <Container className="container" style={containerStyle}>
            <Section className="logo-header">
              <a href={senderInfo.websiteUrl} target="_blank" rel="noreferrer" style={logo}>
                <Img width={162} src={senderInfo.logo} />
              </a>
            </Section>
            <Section className="title" style={titleSection}>
              <Text style={titleText}>{content.title}</Text>
            </Section>
            <Section className="content" style={contentSection}>
              <div style={contentText}>{content.body}</div>
            </Section>
            {content.action && (
              <Section className="action" style={{ ...actionSection }}>
                <Button
                  className="action-button"
                  href={content.action.url}
                  target="_blank"
                  style={{ ...actionButton, ...content.action.buttonStyle }}
                >
                  {content.action.title}
                </Button>
              </Section>
            )}
            {content.hideIgnoreMessage ? (
              <div style={separatorStyle} />
            ) : (
              <div style={ignoreMessage}>Not you? Just ignore this message</div>
            )}
          </Container>
          <Container style={containerBottom}>
            <a
              href={senderInfo.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={addressButton}
            >
              {senderInfo.physicalAddress}
            </a>
            <div style={copyrightStyle}>
              {senderInfo.copyright}
              <br />
              This email was intended for {content.receiverEmail}. This is a service email.
            </div>
          </Container>
        </div>
      </Html>
    ),
  }
}

export async function getSenderInfo({
  sysCall,
}: Pick<CoreContext, 'sysCall'>): Promise<SenderInfo> {
  const {
    configs: { info: orgInfo },
  } = await sysCall.moodle.org.v1_0.pri.system.configs()
  const senderInfo: SenderInfo = {
    copyright: orgInfo.copyright,
    logo: orgInfo.logo,
    name: orgInfo.name,
    physicalAddress: orgInfo.addresses.physicalAddress,
    websiteUrl: orgInfo.addresses.websiteUrl,
  }
  return senderInfo
}

const bodyStyle: React.CSSProperties = {
  minHeight: '100%',
  backgroundColor: '#f1f1f1',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '32px 10px',
}

const containerStyle: React.CSSProperties = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  backgroundColor: '#ffffff',
  borderRadius: '8px 8px 0 0',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 48px 16px 48px',
  textAlign: 'center',
}

const containerBottom: React.CSSProperties = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  borderRadius: '0 0 8px 8px',
  backgroundColor: '#f7fafa',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 48px 48px 48px',
}

const logo: React.CSSProperties = {
  width: 'fit-content',
  margin: '0 auto 16px auto',
  display: 'block',
}

const titleSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '14px 0',
}

const titleText: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
}

const contentSection: React.CSSProperties = {
  background: '#f5f5f5',
  padding: '28px',
  color: '#282828',
  borderRadius: '18px',
  boxShadow: '2px 2px #0000003b',
  textAlign: 'center',
}

const contentText: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '28px',
}

const actionSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '28px 0 0 0',
}

const actionButton: React.CSSProperties = {
  padding: '14px 20px',
  display: 'inline-block',
  borderRadius: '48px',
  background: '#f88012',
  color: '#ffffff',
  fontSize: '15px',
}

const ignoreMessage: React.CSSProperties = {
  textAlign: 'center',
  color: '#999999',
  fontSize: '12px',
  lineHeight: '150%',
  margin: '58px 0 10px 0',
  padding: '0',
}

const separatorStyle: React.CSSProperties = {
  padding: '25px',
}

const addressButton: React.CSSProperties = {
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

const copyrightStyle: React.CSSProperties = {
  margin: '10px 0',
  padding: '0',
  color: '#656565',
  fontFamily: 'Helvetica',
  fontSize: '12px',
  lineHeight: '150%',
  textAlign: 'center',
}
