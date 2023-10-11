import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { FC } from 'react'

function html() {
  return {
    __html: `<!DOCTYPE html>
    <html
      lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <meta charset="utf-8" />
        <!-- utf-8 works for most cases -->
        <meta name="viewport" content="width=device-width" />
        <!-- Forcing initial-scale shouldn't be necessary -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting" />
        <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <title>{{=it.instance-name}}</title>
        <!-- The title tag shows in email notifications, like Android 4.4. -->
    
        <!-- CSS Reset : BEGIN -->
        <style>
          :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
          }
          /* What it does: Remove spaces around the email design added by some email clients. */
          /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
          html,
          body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background: #f1f1f1;
          }
    
          /* What it does: Stops email clients resizing small text. */
          * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }
    
          /* What it does: Centers email on Android 4.4 */
          div[style*='margin: 16px 0'] {
            margin: 0 !important;
          }
    
          /* What it does: Stops Outlook from adding extra spacing to tables. */
          table,
          td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
          }
    
          /* What it does: Fixes webkit padding issue. */
          table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
          }
    
          /* What it does: Uses a better rendering method when resizing images in IE. */
          img {
            -ms-interpolation-mode: bicubic;
          }
    
          /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
          a {
            text-decoration: none;
          }
    
          /* What it does: A work-around for email clients meddling in triggered links. */
          *[x-apple-data-detectors],  /* iOS */
          .unstyle-auto-detected-links *,
          .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
    
          /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
          .a6S {
            display: none !important;
            opacity: 0.01 !important;
          }
    
          /* What it does: Prevents Gmail from changing the text color in conversation threads. */
          .im {
            color: inherit !important;
          }
    
          /* If the above doesn't work, add a .g-img class to any image in question. */
          img.g-img + div {
            display: none !important;
          }
    
          /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
          /* Create one of these media queries for each additional viewport size you'd like to fix */
    
          /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
          @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u ~ div .email-container {
              min-width: 320px !important;
            }
          }
          /* iPhone 6, 6S, 7, 8, and X */
          @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u ~ div .email-container {
              min-width: 375px !important;
            }
          }
          /* iPhone 6+, 7+, and 8+ */
          @media only screen and (min-device-width: 414px) {
            u ~ div .email-container {
              min-width: 414px !important;
            }
          }
        </style>
    
        <!-- CSS Reset : END -->
    
        <!-- Progressive Enhancements : BEGIN -->
        <style>
          .primary {
            background: #f88012;
          }
          .bg_white {
            background: #ffffff;
          }
          .bg_light {
            background: #f7fafa;
          }
          .bg_black {
            background: #000000;
          }
          .bg_dark {
            background: rgba(0, 0, 0, 0.8);
          }
          .email-section {
            padding: 2.5em;
          }
    
          /*BUTTON*/
          .btn {
            padding: 10px 15px;
            display: inline-block;
          }
          .btn.btn-primary {
            border-radius: 45px;
            background: #f88012;
            color: #ffffff;
            padding: 10px 40px;
          }
          .btn.btn-white {
            border-radius: 5px;
            background: #ffffff;
            color: #000000;
          }
    
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-family: 'Helvetica', sans-serif;
            color: #000000;
            margin-top: 0;
            font-weight: 400;
          }
    
          body {
            font-family: 'Helvetica', sans-serif;
            font-weight: 400;
            font-size: 15px;
            line-height: 1.8;
            color: rgba(0, 0, 0, 0.4);
          }
    
          a {
            color: #17bebb;
          }
    
          /*LOGO*/
    
          .logo h1 {
            margin: 0;
          }
          .logo h1 a {
            color: #17bebb;
            font-size: 24px;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
          }
    
          /*HERO*/
          .hero {
            position: relative;
            z-index: 0;
          }
    
          .hero .text {
            color: rgba(0, 0, 0, 0.3);
          }
          .hero .text h2 {
            color: #000;
            font-size: 18px;
            margin-bottom: 0;
            font-weight: 600;
            line-height: 1.4;
          }
          .hero .text h3 {
            font-size: 24px;
            font-weight: 300;
          }
          .hero .text h2 span {
            font-weight: 600;
            color: #000;
          }
    
          .text-author {
            position: relative;
            max-width: 480px;
            width: 90%;
            margin: 0 auto;
            padding: 25px 0 0;
          }
    
          .dialog {
            background: #f5f5f5;
            padding: 25px;
            color: #282828;
            border-radius: 15px;
            box-shadow: 2px 2px #0000003b;
          }
    
          .disclaimer {
            font-size: 12px;
            color: #687082;
          }
    
          .text-author img {
            border-radius: 50%;
            padding-bottom: 20px;
          }
          .text-author h3 {
            margin-bottom: 0;
          }
          ul.social {
            padding: 0;
          }
          ul.social li {
            display: inline-block;
            margin-right: 10px;
          }
    
          /*FOOTER*/
    
          .footer {
            height: fit-content;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            color: rgba(0, 0, 0, 0.5);
          }
          .footer .heading {
            color: #000;
            font-size: 20px;
          }
          .footer ul {
            margin: 0;
            padding: 0;
          }
          .footer ul li {
            list-style: none;
            margin-bottom: 10px;
          }
          .footer ul li a {
            color: rgba(0, 0, 0, 1);
          }
    
          @media screen and (max-width: 500px) {
          }
        </style>
      </head>
    
      <body
        width="100%"
        style="
          margin: 0;
          padding: 0 !important;
          mso-line-height-rule: exactly;
          background-color: #f1f1f1;
        "
      >
        <center style="width: 100%; background-color: #f1f1f1">
          <div
            style="
              display: none;
              font-size: 1px;
              max-height: 0px;
              max-width: 0px;
              opacity: 0;
              overflow: hidden;
              mso-hide: all;
              font-family: sans-serif;
            "
          >
            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
          </div>
          <div style="max-width: 600px; margin: 0 auto" class="email-container">
            <!-- BEGIN BODY -->
            <table
              align="center"
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
              width="100%"
              style="margin: auto; padding-bottom: 20px"
            >
              <tr>
                <td valign="top" class="bg_white" style="padding: 25px 25px 0 25px">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td class="logo" style="text-align: center">
                        <h1>
                           <a href={{=it.domain-url}} target="_blank"
                            ><img
                              src={{=it.instance-logo-url}}
                              alt="Domain logo"
                              style="width: 162px; margin: auto; display: block"
                          /></a>
                        </h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- end tr -->
              <!-- 1 Column Text + Button : END -->
            </table>
            <table
              align="center"
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
              width="100%"
              style="margin: auto"
            >
              <tr>
                <td valign="middle" class="hero bg_white" style="padding: 60px 0">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding: 0 2.5em; text-align: center">
                        <div class="text">
                          <h2>{{=it.sender-display-name}} sent you a message 📨</h2>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center">
                        <div class="text-author">
                          <div class="dialog">
                            {{=it.message}}
                          </div>
                          <p style="margin: 25px 0">
                            <a href={{=it.action-button-url}} class="btn btn-primary" target="_blank">Reply at {{=it.instance-name}}</a>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- end tr -->
              <!-- 1 Column Text + Button : END -->
            </table>
            <table
              align="center"
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
              width="100%"
              style="margin: auto"
            >
              <tr>
                <td valign="middle" class="bg_light footer email-section">
                  <table>
                    <tr>
                      <td
                        valign="top"
                        style="
                          padding-top: 0;
                          padding-right: 18px;
                          padding-left: 18px;
                          word-break: break-word;
                          color: #656565;
                          font-family: Helvetica;
                          font-size: 12px;
                          line-height: 150%;
                          text-align: center;
                        "
                      >
                        <p
                          style="
                            margin: 10px 0;
                            padding: 0;
                            color: #656565;
                            font-family: Helvetica;
                            font-size: 12px;
                            line-height: 150%;
                            text-align: center;
                          "
                        >
                          <a
                            href={{=it.location-url}}
                            target="_blank"
                            data-saferedirecturl={{=it.location-url}}
                            >{{=it.location}}</a
                          >
                        </p>
    
                        <p
                          style="
                            margin: 10px 0;
                            padding: 0;
                            color: #656565;
                            font-family: Helvetica;
                            font-size: 12px;
                            line-height: 150%;
                            text-align: center;
                          "
                        >
                        {{=it.copyright}}<br />
                          This email was intended for
                          <a href="mailto:{{=it.receiver-email}}" target="_blank">{{=it.receiver-email}}</a>.
                          This is a service email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- end: tr -->
            </table>
          </div>
        </center>
      </body>
    </html>
    `
      .replace('{{=it.sender-display-name}}', 'Nelson Candela')
      .replace(
        '{{=it.message}}',
        `Dear MoodleNetter, the quality of your content is just great! We are very
      happy to have contributors like you. Thank you for you efforts!`,
      )
      .replaceAll('{{=it.instance-name}}', 'MoodleNet')
      .replaceAll(
        '{{=it.instance-logo-url}}',
        'https://i.ibb.co/cDZ97rk/Moodle-Net-Logo-Colour-RGB.png',
      )
      .replaceAll('{{=it.domain-url}}', 'https://moodle.net')
      .replaceAll(
        '{{=it.location-url}}',
        'http://mailsend.moodle.com/track/click/30829846/www.google.com?p=eyJzIjoia2ZVN0M2eHBsV2VxVGxfQkVMbmxRcEhNVWpBIiwidiI6MSwicCI6IntcInVcIjozMDgyOTg0NixcInZcIjoxLFwidXJsXCI6XCJodHRwczpcXFwvXFxcL3d3dy5nb29nbGUuY29tXFxcL21hcHNcXFwvcGxhY2VcXFwvTW9vZGxlXFxcL0AtMzEuOTQ4OTkxOSwxMTUuODQwMzkyMywxNXpcXFwvZGF0YT0hNG01ITNtNCExczB4MDoweDJiZmY3YmVkZjQzYjRmYzchOG0yITNkLTMxLjk0ODk5MTkhNGQxMTUuODQwMzkyM1wiLFwiaWRcIjpcIjgwYjI4NzUzNGFmMDQ5ZGY4NjhiNjBkYjRjZDg2OGNkXCIsXCJ1cmxfaWRzXCI6W1wiNjdhMmU4MjRhOTNkOGNhODE3YzhiYmY1YTliNzhiMTM0NzczM2MxYVwiXX0ifQ',
      )
      .replace('{{=it.location}}', 'PO Box 303, West Perth WA 6872, Australia')
      .replace('{{=it.copyright}}', 'Copyright © 2021 Moodle Pty Ltd, All rights reserved.')
      .replaceAll('{{=it.receiver-email}}', 'caterine.z.pons@temail.com')
      .replaceAll(
        '{{=it.action-button-url}}',
        'https://moodle.net/profile/7pg2ied7z3dy-carlo-cavicchioli',
      ),
  }
}

export const Email: FC = () => {
  return <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={html()} />
}

const meta: ComponentMeta<typeof Email> = {
  title: 'Pages/Emails/Social/MessageReceivedEmail',
  excludeStories: ['Email'],
  parameters: { layout: 'fullscreen' },
}

const MessageReceivedEmailStory: ComponentStory<typeof Email> = () => <Email />

export const Default: typeof MessageReceivedEmailStory = MessageReceivedEmailStory.bind({})

export default meta
