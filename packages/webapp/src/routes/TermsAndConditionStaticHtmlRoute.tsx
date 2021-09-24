import { Trans } from '@lingui/macro'
import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { FC } from 'react'
import { MNRouteProps, RouteFC } from './lib'

export const TermsAndConditionsComponent: RouteFC<Routes.TermsAndConditions> = (/* { match } */) => {
  return <TermsAndConditionsPage />
}

export const TermsAndConditionsRoute: MNRouteProps<Routes.TermsAndConditions> = {
  component: TermsAndConditionsComponent,
  path: '/terms',
  exact: true,
}
export const TermsAndConditionsPage: FC = () => {
  return (
    <div id="terms-and-conditions-page">
      <Trans>
        PLEASE READ THE FOLLOWING. BY USING THIS INSTANCE OF MOODLENET YOU ARE CONSENTING TO THESE AGREEMENTS
      </Trans>
      <div dangerouslySetInnerHTML={{ __html: rawHTMLTerms }}></div>
    </div>
  )
}

const rawHTMLTerms = `
<h1 id="moodlenet-user-agreement">MoodleNet User Agreement</h1>
<h2 id="1-terms">1. Terms</h2>
<p>
  By accessing or using this MoodleNet instance, you are agreeing to be
  bound by these terms, and all applicable laws and regulations. If you do
  not agree with any of these terms, you are prohibited from using or
  accessing this site. The software and materials contained in this website
  are protected by applicable copyright law and open source and commons
  licences as indicated.
</p>
<h2 id="2-code-of-conduct">2. Code of Conduct</h2>
<h3 id="21-pledge">2.1 Pledge</h3>
<p>
  In the interest of fostering an open and welcoming environment, we as
  users, contributors and maintainers of MoodleNet pledge to make
  participation in our project and our community a harassment-free
  experience for everyone, regardless of age, body size, disability,
  ethnicity, sex characteristics, gender identity and expression, level of
  experience, education, socio-economic status, nationality, personal
  appearance, race, religion, or sexual identity and orientation.
</p>
<h3 id="22-encouraged-behaviour">2.2 Encouraged Behaviour</h3>
<p>
  Examples of behaviour that contributes to creating a positive environment
  include:
</p>
<ul>
  <li>Using welcoming and inclusive language</li>
  <li>Being respectful of differing viewpoints and experiences</li>
  <li>Gracefully accepting constructive criticism</li>
  <li>Focusing on what is best for the community</li>
  <li>Showing empathy towards other community members</li>
</ul>
<h3 id="23-unacceptable-behaviour">2.3 Unacceptable Behaviour</h3>
<p>
  Racism, sexism, homophobia, transphobia, harassment, defamation, doxxing,
  sexual depictions of children, and conduct promoting alt-right and fascist
  ideologies will not be tolerated.
</p>
<p>Other examples of unacceptable behaviour by participants include:</p>
<ul>
  <li>
    The use of sexualised language or imagery and unwelcome sexual attention
    or advances
  </li>
  <li>
    Trolling, insulting/derogatory comments, and personal or political
    attacks
  </li>
  <li>Public or private harassment</li>
  <li>
    Publishing others’ private information, such as a physical or electronic
    address, without explicit permission
  </li>
  <li>
    Other conduct which could reasonably be considered inappropriate in a
    professional setting
  </li>
</ul>
<h3 id="24-responsibilities-of-users-and-contributors">
  2.4 Responsibilities of users and contributors
</h3>
<p>
  Users and contributors are responsible for watching out for any
  unacceptable behaviour or content, such as harassment, and bringing it to
  moderators' attention by using the flagging functionality. If moderators
  do not respond in a timely or appropriate manner, users are to alert the
  instance operators, and failing that, Moodle HQ at
  <a href="mailto:moodlenet-moderators@moodle.com"
    >moodlenet-moderators@moodle.com</a
  >.
</p>
<h3
  id="25-responsibilities-of-the-project-maintainers-such-as-instance-operators-community-moderators-and-moodle-hq"
>
  2.5 Responsibilities of the project maintainers (such as instance
  operators, community moderators, and Moodle HQ)
</h3>
<p>
  Project maintainers, including instance operators, community moderators,
  and Moodle HQ, given the relevant access, are responsible for monitoring
  and acting on flagged content and other user reports, and have the right
  and responsibility to remove, edit, or reject comments, communities,
  collections, resources, images, code, wiki edits, issues, and other
  contributions that are not aligned to this Code of Conduct, or to suspend
  or ban - temporarily or permanently - any contributor for breaking these
  terms, or for other behaviours that they deem inappropriate, threatening,
  offensive, or harmful.
</p>
<p>
  Instance operators should ensure that every community hosted on the
  instance is properly moderated according to the Code of Conduct.
</p>
<p>
  Project maintainers are responsible for clarifying the standards of
  acceptable behaviour and are expected to take appropriate and fair
  corrective action in response to any unacceptable behaviour.
</p>
<h3 id="26-enforcement">2.6 Enforcement</h3>
<p>
  All complaints must be reviewed and investigated by project maintainers,
  and result in a response that is deemed necessary and appropriate to the
  circumstances. Project maintainers are obligated to maintain
  confidentiality with regard to the reporter of an incident. Further
  details of specific enforcement policies may be posted separately.
</p>
<p>
  Project maintainers who do not follow or enforce the Code of Conduct in
  good faith may face temporary or permanent repercussions as determined by
  other maintainers of the project.
</p>
<h3 id="27-code-of-conduct-attribution">2.7 Code of Conduct Attribution</h3>
<p>
  This Code of Conduct was adapted from the
  <a href="https://www.contributor-covenant.org/">Contributor Covenant</a>
  (<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>),
  <a
    href="https://www.contributor-covenant.org/version/1/4/code-of-conduct.html"
    >version 1.4</a
  >.
</p>
<h2 id="3-contribution-use-modification-and-distribution-licenses">
  3. Contribution, Use, Modification, and Distribution Licenses
</h2>
<ol start="1">
  <li>
    Unless otherwise noted, all content or materials that you see, share,
    contribute, and/or download on this instance is made available under a
    <a href="https://creativecommons.org/licenses/by-sa/4.0/"
      >Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA
      4.0) license</a
    >. This does not necessarily include links to other websites.
  </li>
  <li>
    MoodleNet is powered by free software, meaning that you have the
    following basic freedoms:
    <ul>
      <li>The freedom to run the software as you wish, for any purpose.</li>
      <li>
        The freedom to study how the software works, and change it so it
        does your computing as you wish. Access to the source code is a
        precondition for this.
      </li>
      <li>The freedom to redistribute copies so you can help others.</li>
      <li>
        The freedom to distribute copies of your modified versions to
        others. By doing this you can give the whole community a chance to
        benefit from your changes.
      </li>
    </ul>
  </li>
  <li>
    Permission is granted to run, study, redistribute, and distribute
    modified copies of the MoodleNet software according to the terms of the
    <a href="https://www.gnu.org/licenses/agpl-3.0.en.html"
      >GNU Affero Public License 3.0</a
    >
    (“AGPL”). Note that this is different to the GPL license used for
    Moodle Core. The AGPL mandates that the source of your MoodleNet
    instance must be available to be downloaded even if you are providing a
    service rather than making available a binary. Further information is
    available at
    <a
      href="https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0"
      >legal</a
    >&gt;).
  </li>
</ol>
<h2 id="4-disclaimers">4. Disclaimers</h2>
<h3 id="41-materials-provided-as-is">4.1. Materials provided 'as is'</h3>
<p>
  The materials on this website have been contributed by other users, and
  are provided on an 'as is' basis. Neither the site operator, nor Moodle
  Pty Ltd (“Moodle HQ”), make any warranties, expressed or implied. They
  hereby disclaim and negate all other warranties including, without
  limitation, implied warranties or conditions of merchantability, fitness
  for a particular purpose, or non-infringement of intellectual property or
  other violation of rights.
</p>
<h3 id="42-accuracy">4.2. Accuracy</h3>
<p>
  Furthermore, neither the site operator, nor Moodle HQ, make any
  representations concerning the accuracy, likely results, or reliability of
  use of the materials on this website - which may be incomplete or
  outdated, or could include technical, typographical, or photographic
  errors - or relating to such materials or on any sites linked from this
  site.
</p>
<p>
  Changes may be made to the materials contained on its website at any time
  without notice. However, neither the site operator nor Moodle HQ make any
  commitment to update the materials.
</p>
<h3 id="43-links">4.3. Links</h3>
<p>
  Neither the site operator nor Moodle HQ have reviewed all of the sites
  linked from this website and are not responsible for the contents of any
  such linked site. The inclusion of any link does not imply endorsement of
  the site. Use of any such linked website is at the user's own risk.
</p>
<h3 id="44-limitations">4.4. Limitations</h3>
<p>
  In no event shall the site operator, Moodle HQ, or their suppliers be
  liable for any damages (including, without limitation, damages for loss of
  data or profit, or due to business interruption) arising out of the use or
  inability to use the materials on this website, even if any authorized
  representative has been notified orally or in writing of the possibility
  of such damage. Because some jurisdictions do not allow limitations on
  implied warranties, or limitations of liability for consequential or
  incidental damages, these limitations may not apply to you.
</p>
<h3 id="5-modifications">5. Modifications</h3>
<p>
  The site operator may revise these terms of service for its website at any
  time without notice. By using this website you are agreeing to be bound by
  the then current version of these terms.
</p>
<h2 id="privacy-notice">PRIVACY NOTICE</h2>
<p>Last updated 6th of October 2020</p>
<p>
  This Privacy Notice tells you how we, Moodle Pty Ltd, will collect and use
  your personal data to provide our MoodleNet service which allows
  educators, of any kind, to create a private social space online, all
  optimized for collaborative learning, and connect their installation to a
  wider network of networks. MoodleNet is the name of one of our pieces of
  software, which can be installed and hosted by anyone. It includes an
  option to link to a network of other installations, which we facilitate by
  running a central API service and search index. We will refer to it as the
  "mothership".
</p>
<p>
  The MoodleNet software is free and open source, and may be hosted by
  anyone who wishes to manage an installation. This notice will only tell
  you how Moodle Pty Ltd uses your MoodleNet personal data, but if the site
  you are using isn’t hosted by Moodle Pty Ltd, then your data controller
  will have their own specific Privacy Notice as well, on how your data is
  used by them.
</p>
<h3 id="who-are-we">Who are we?</h3>
<p>
  Moodle Pty Ltd is a software company which allows educators, of any kind,
  to create a private space&nbsp;online, filled with tools that easily
  create courses and activities, all optimized for
  collaborative&nbsp;learning. MoodleNet is open source, and may be hosted
  by Moodle Pty Ltd, but also by anyone who wishes to manage an
  installation.
</p>
<h3 id="whats-covered-by-this-privacy-notice">
  What’s covered by this Privacy Notice?
</h3>
<p>
  Under the EU’s General Data Protection Regulation (GDPR) personal data is
  defined as:&nbsp;“any information relating to an identified or
  identifiable natural person (‘data subject’); an identifiable
  natural&nbsp;person is one who can be identified, directly or indirectly,
  in particular by reference to an identifier such as a&nbsp;name, an
  identification number, location data, an online identifier or to one or
  more factors specific to the&nbsp;physical, physiological, genetic,
  mental, economic, cultural or social identity of that natural person”.
</p>
<p>
  All data subjects whose personal data is collected, in line with the
  requirements of the GDPR.
</p>
<ul>
  <li>
    where Moodle Pty Ltd is hosting a MoodleNet website on its own behalf,
    it is the Data Controller for all the data collected.
  </li>
  <li>
    On instances <em>not</em> hosted by Moodle Pty Ltd, we provide the
    "mothership" service that indexes data as well as provides search and
    discovery across federated instances. In this case, we index public
    content from other instances to allow this to happen. Our relationship
    with instance administrators is therefore both as:
    <ul>
      <li>
        Joint Data Controller (in respect of certain elements of personal
        data made public by users which Moodle Pty Ltd makes searchable
        across the federated instances connected to the "mothership")
      </li>
      <li>
        Data Processor (Instance administrators act as the Data Controller,
        and can request Moodle Pty Ltd to delete personal data on the data
        subject from the "mothership")
      </li>
    </ul>
  </li>
</ul>
<p>
  We are processing personal data for the purposes of identification on a
  federated social network made up of individually hosted installations of
  our MoodleNet software. We envisage that this will lead to increased trust
  and sharing of resources and ideas amongst the educators using federated
  MoodleNet instances. Users will be able to identify one another, talk
  about shared interests and goals, and both link to and upload resources
  that will help their communities. It is not compulsory for 3rd parties to
  link their instance of MoodleNet to the "mothership". If they do not, none
  of their users’ personal data will be processed by Moodle Pty Ltd.
</p>
<p>
  We will be collecting users’ personal data, including: username, display
  name, location, bio, language(s), images, links, resources uploaded,
  comments, browser version, and IP address. This does not include criminal
  offence data, but may include special categories such as political beliefs
  and accessibility requirements. We could also infer ethnicity through
  avatars, including photographs, that users choose to represent themselves.
  This would be as a by-product of using the system, through optional rather
  than mandatory activity (e.g. tagging, photo-upload, discussion replies).
</p>
<p>
  While users may have the ability to hide information about themselves on
  their profile so that only they can see it, please be aware that this only
  hides information from other users (as well as from the "mothership"), but
  not from the operator of the instance.
</p>
<p>
  We want users to be aware that they might, implicitly and explicitly,
  reveal sensitive information such as their preferences, any disabilities,
  and ethnicity or location data through what they choose to upload or share
  on instances of MoodleNet.
</p>
<h3 id="why-does-moodle-pty-ltd-need-to-collect-and-store-personal-data">
  Why does Moodle Pty Ltd need to collect and store personal data?
</h3>
<p>
  MoodleNet is a piece of open source software, which can be integrated with
  an optional service (the MoodleNet "mothership") in order for Moodle Pty
  Ltd to provide users and instance hosters with a service that indexes data
  as well as provides search and discovery across federated instances. We
  need to collect personal data&nbsp;to interact with users and/or to allow
  us to provide you our service(s). We are committed to&nbsp;ensuring that
  the information we collect and use is appropriate for this purpose and no
  more than is necessary and proportionate for those purposes.
</p>
<p>
  Moodle Pty Ltd is a company which values&nbsp;its users’ data protection
  and privacy rights and we have no interest in collecting data beyond what
  we need to make&nbsp;our service(s) work for you.
</p>
<p>
  If you are going to be contacted by us for marketing purposes, we will not
  rely solely on this notice, but will&nbsp;always seek an additional
  confirmation from you that it’s ok to do that.
</p>
<p>
  <strong
    >In general we collect personal data relating to you for specific
    purposes, with the nature of the data&nbsp;collected depending on your
    interaction with Moodle Pty Ltd. We are committed to transparency
    in&nbsp;this and have provided a very detailed breakdown of these
    processes in Annex 1 of this Privacy Notice.</strong
  >
</p>
<p>Our legal basis for the processing of personal data are:</p>
<ul>
  <li>Article 6.1(a), GDPR, Consent</li>
  <li>Article 6.1(b), GDPR, Contract</li>
  <li>Article 6.1(f), GDPR, Legitimate Interest</li>
</ul>
<p>The special categories of personal data potentially concerned are:</p>
<ul>
  <li>biometric data in the form of facial images</li>
  <li>
    any special categories of special personal data which any user
    volunteers while using the MoodleNet systems
  </li>
</ul>
<h3 id="will-moodle-pty-ltd-share-my-personal-data-with-anyone-else">
  Will Moodle Pty Ltd share my personal data with anyone else?
</h3>
<p>
  We may pass your personal data on to third-party service providers
  contracted to Moodle Pty Ltd in the course of&nbsp;dealing with you. We do
  this because there are some services, which will&nbsp;not work unless we
  are able to make these transfers. Any third parties that we may share your
  data with are obliged&nbsp;to keep your details securely, and to use them
  only to deliver the service they provide on our- and of course- your
  behalf. When they no longer need your data to fulfil this service, they
  will dispose of the details in line with&nbsp;Moodle Pty Ltd’s procedures.
  If we wish to pass your sensitive personal data onto a third party we will
  only do so&nbsp;once we have obtained your consent, or if it is necessary
  to comply with a contract, or we are&nbsp;legally required to do so. If
  you would like an up-to-date register of all our third-party service
  providers for MoodleNet,&nbsp;please contact
  <a href="mailto:privacy@moodle.com">privacy@moodle.com</a> and we will be
  happy to provide it.
</p>
<h3 id="how-will-moodle-pty-ltd-use-the-personal-data-it-collects-about-me">
  How will Moodle Pty Ltd use the personal data it collects about me?
</h3>
<p>
  Moodle Pty Ltd will process (collect, store and use) the information you
  provide in a manner compatible with the EU’s&nbsp;General Data Protection
  Regulation (GDPR). We will endeavour to keep your information accurate and
  up to date, and&nbsp;not keep it for longer than is necessary. Moodle Pty
  Ltd maintains a register of its data processes which includes
  a&nbsp;record of the data retention policy for each type of data collected
  and is committed to only ever trying to process&nbsp;the minimum amount of
  data needed. Moodle Pty Ltd is required to retain certain information in
  accordance with the&nbsp;Law, such as information needed for income tax
  and audit purposes. How long certain kinds of personal data should
  be&nbsp;kept may also be governed by specific business-sector requirements
  and agreed practices. Personal data may be held&nbsp;in addition to these
  periods depending on individual business needs.
</p>
<h3 id="can-i-find-out-what-personal-data-moodle-pty-ltd-holds-about-me">
  Can I find out what personal data Moodle Pty Ltd holds about me?
</h3>
<p>
  Moodle Pty Ltd at your request, can confirm what information we hold about
  you and how it is processed. If Moodle Pty&nbsp;Ltd does hold personal
  data about you, you can request the following information:
</p>
<ul>
  <li>
    identity and the contact details of the person or organisation that has
    determined how and why to process your&nbsp;data.
  </li>
  <li>
    contact details of our data protection officer in the EU, where
    applicable.
  </li>
  <li>
    the purpose of the processing as well as the legal basis for processing.
  </li>
  <li>
    if the processing is based on the legitimate interests of Moodle Pty Ltd
    or a third party, information about&nbsp;those interests.
  </li>
  <li>the categories of personal data collected, stored and processed.</li>
  <li>
    recipient(s) or categories of recipients that the data is/will be
    disclosed to.
  </li>
  <li>
    if we intend to transfer the personal data to a third country or
    international organisation, information about&nbsp;how we ensure this is
    done securely.
  </li>
  <li>
    the EU has approved sending personal data to some countries because
    they&nbsp;meet a minimum standard of data protection. In other cases, we
    will ensure there are specific measures in place&nbsp;to secure your
    information. These will rely on measures approved by the EU Commission.
  </li>
  <li>how long the data will be stored.</li>
  <li>
    details of your rights to correct, erase, restrict or object to such
    processing.
  </li>
  <li>information about your right to withdraw consent at any time.</li>
  <li>how to lodge a complaint with the relevant supervisory authority.</li>
  <li>
    whether the provision of personal data is a statutory or contractual
    requirement, or a requirement necessary to&nbsp;enter into a contract,
    as well as whether you are obliged to provide the personal data and the
    possible&nbsp;consequences of failing to provide such data.
  </li>
  <li>
    the source of personal data if it wasn’t collected directly from you.
  </li>
  <li>
    any details and information of automated decision making, such as
    profiling, and any meaningful information&nbsp;about the logic involved,
    as well as the significance and expected consequences of such
    processing.
  </li>
</ul>
<h3 id="what-forms-of-id-will-i-need-to-provide-in-order-to-access-this">
  What forms of ID will I need to provide in order to access this?
</h3>
<p>
  Moodle Pty Ltd accepts a request made through a Moodle user while the
  person making the request is logged in. In certain circumstances Moodle
  Pty Ltd could ask for additional information and the following forms of ID
  when information on your personal data is requested:
</p>
<ul>
  <li>A colour copy of a Passport, driving licence or National ID Card</li>
</ul>
<h3 id="agreeing-to-these-terms-is-your-consent">
  Agreeing to these terms is your Consent
</h3>
<p>
  By consenting to this privacy notice you are giving us permission to
  process your personal data specifically for the purposes identified. Where
  consent is required for Moodle Pty Ltd to process both standard and
  sensitive types of personal data, it must be explicitly given. Where we
  are asking you for sensitive personal data we will always tell you why and
  how the information will be used. Agreement with this Privacy Notice and
  its accompanying terms and conditions (as applicable) (and any Data
  Processing Agreements, if they apply to you) will be considered to be
  explicit consent and we will keep a copy of the records of that consent
  for audit purposes.
</p>
<p>You may withdraw consent at any time by:</p>
<ul>
  <li>
    <strong>MoodleNet hosted websites:</strong><br />contacting
    <a href="mailto:privacy@moodle.com">privacy@moodle.com</a>
  </li>
  <li>
    <strong>self-hosted MoodleNet installations:</strong><br />contacting
    the instance's Data Protection Officer or Privacy Officer for your Data
    Controller (reach out to your instance administrator(s) if you don't
    know who to contact)
  </li>
</ul>
<p>
  Please identify your role in relation to MoodleNet (if you are an
  end-user, site admin etc.), and the data you wish to withdraw consent to
  be processed.
</p>
<h3 id="disclosure">Disclosure</h3>
<p>
  Moodle Pty Ltd will pass on your personal data to certain third parties.
  Moodle Pty Ltd is a distributed, global company and it uses cloud services
  which may be accessed by its employees in any part of the world, including
  the head office in Australia.
</p>
<p>
  The MoodleNet software platform is open source, so that anyone can install
  and host a copy of the software, as the data controller. In those
  circumstances, it will be a matter for the Data Controller to ensure they
  have also put the necessary safeguards in place for any international
  transfers outside the EU.
</p>
<table>
  <thead>
    <tr>
      <th style="text-align: center">
        <strong>Third country (non EU/international organisation)</strong>
      </th>
      <th style="text-align: center">
        <strong>Safeguards in place to protect your personal data</strong>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center">
        MoodleCloud: Australia, global <br /><br /><br />
      </td>
      <td style="text-align: center">
        Use of the EU's Standard Contract clauses, Privacy Shield, and
        binding corporate rules
      </td>
    </tr>
    <tr>
      <td style="text-align: center">
        Other Moodle sites and services <br /><br /><br />
      </td>
      <td style="text-align: center">
        Use of the EU's Standard Contract clauses, Privacy Shield, and
        binding corporate rules
      </td>
    </tr>
    <tr>
      <td style="text-align: center">
        Other Moodle installations not hosted by Moodle Pty Ltd or
        additional processing of data from MoodleCloud by the Data
        Controller<br /><br /><br />
      </td>
      <td style="text-align: center">
        To be provided directly to you by the Data Controller for that
        installation
      </td>
    </tr>
  </tbody>
</table>
<h3 id="retention-period">Retention period</h3>
<p>
  Moodle Pty Ltd will process different forms of personal data for as long
  as is necessary and proportionate for the purpose for which it has been
  supplied and will store the personal data for the shortest amount of time
  possible, taking into user legal and service requirements. For further
  details on the retention period for any particular type of data, please
  contact <a href="mailto:privacy@moodle.com">privacy@moodle.com</a>
</p>
<h3 id="your-rights-as-a-data-subject">Your rights as a data subject</h3>
<p>
  At any point while we are in possession of or processing your personal
  data, you, the data subject, have the following rights:
</p>
<ul>
  <li>
    <strong>right of access</strong> : you have the right to request a copy
    of the information that we hold about you.
  </li>
  <li>
    <strong>right of rectification</strong> : you have a right to correct
    data that we hold about you that is inaccurate or incomplete.
  </li>
  <li>
    <strong>right to be forgotten</strong> : in certain circumstances you
    can ask for the data we hold about you to be erased from our records.
  </li>
  <li>
    <strong>right to restriction of processing</strong> : where certain
    conditions apply to have a right to restrict the processing.
  </li>
  <li>
    <strong>right of portability</strong> : you have the right to have the
    data we hold about you transferred to another organisation.
  </li>
  <li>
    <strong>right to object</strong> : you have the right to object to
    certain types of processing such as direct marketing.
  </li>
  <li>
    <strong
      >right to object to automated processing, including profiling</strong
    >
    : you also have the right to be subject to the legal effects of
    automated processing or profiling.
  </li>
  <li>
    <strong>right to judicial review</strong> : in the event that Moodle Pty
    Ltd refuses your request under rights of access, we will provide you
    with a reason as to why. You have the right to complain as outlined in
    the section named “Complaints” below.
  </li>
</ul>
<p>
  Where Moodle Pty Ltd are your Data Controller, you may make a request
  directly to the Data Protection Officer using the email address
  <a href="mailto:dpo@moodle.com">dpo@moodle.com</a>
</p>
<p>
  Where Moodle Pty Ltd are a Data Processor, and act on behalf of a data
  controller such as an independently hosted instance of MoodleNet with an
  API connection to the "mothership", any requests received by Moodle Pty
  Ltd will be passed on to the Data Controller.
</p>
<p>
  Where Moodle Pty Ltd are not involved with your data, such as where the
  MoodleNet instance has been self-hosted, you should address your requests
  to the data controllers of those sites since Moodle Pty Ltd will have no
  access to your data.
</p>
<h3 id="complaints">Complaints</h3>
<p>
  In the event that you wish to make a complaint about how your personal
  data is being processed by Moodle Pty Ltd (or third parties as described
  above), or how your complaint has been handled, you have the right to
  lodge a complaint directly with supervisory authority and also with Moodle
  Pty Ltd’s Data Protection Officer, Data Compliance Europe.
</p>
<p>
  If you wish to make a complaint about how your personal data has been
  processed in MoodleCloud, or by a Self-Hosted installation of the Moodle
  Software you should contact your Moodle Site Admin or the Data Controller
  for your Moodle installation. (For example, if your university or school
  hosts their own MoodleNet site, they will be the Data Controller).
</p>
<p>
  The details of Contacts for where Moodle Pty Ltd’s are the Data
  Controller:
</p>
<table>
  <thead>
    <tr>
      <th style="text-align: center">
        <strong>Supervisory authority contact details</strong>
      </th>
      <th style="text-align: center">
        <strong
          >Data Protection Officer (DPO) / GDPR Owner contact
          details</strong
        >
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center">Data Protection Commissioner</td>
      <td style="text-align: center">Data Compliance Europe</td>
    </tr>
    <tr>
      <td style="text-align: center">Canal House</td>
      <td style="text-align: center">Lower Bridge Street</td>
    </tr>
    <tr>
      <td style="text-align: center">Portarlington</td>
      <td style="text-align: center">Dublin 8</td>
    </tr>
    <tr>
      <td style="text-align: center">Co Laois</td>
      <td style="text-align: center"></td>
    </tr>
    <tr>
      <td style="text-align: center">R32 AP23</td>
      <td style="text-align: center"></td>
    </tr>
    <tr>
      <td style="text-align: center">
        <a href="mailto:info@dataprotection.ie">info@dataprotection.ie</a>
      </td>
      <td style="text-align: center">
        <a href="mailto:dpo@moodle.com">dpo@moodle.com</a>
      </td>
    </tr>
    <tr>
      <td style="text-align: center">+353 57 8684800</td>
      <td style="text-align: center">+353 1 6351580</td>
    </tr>
  </tbody>
</table>
<p>
  The details of Contacts for where Moodle Pty Ltd is not the Data
  Controller, in your installation of Moodle are available directly from
  your Data Controller.
</p>
<h3 id="annex-1">ANNEX 1</h3>
<table>
  <thead>
    <tr>
      <th style="text-align: left">
        <strong>CATEGORIES OF PERSONAL DATA</strong>
      </th>
      <th style="text-align: center">
        <strong>PURPOSE OF PROCESSING</strong>
      </th>
      <th style="text-align: center">
        <strong>THE SOURCE OF PERSONAL DATA</strong>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left">
        <strong
          >Display name, avatar, bio, interests, language, <br />occupation,
          location, tags</strong
        ><br />Could be inferred: workplace, origin, political opinions,
        <br />religious beliefs, gender, sexuality, accessibility
        requirements <br /><br />
      </td>
      <td style="text-align: center">User registration</td>
      <td style="text-align: center">Data subject (user)</td>
    </tr>
    <tr>
      <td style="text-align: left">
        <strong>Descriptions, language, metadata</strong><br />Could be
        inferred: interests, occupation, location, workplace, location,
        <br />origin, political opinions, religious beliefs, gender,
        <br />sexuality, accessibility requirements <br /><br />
      </td>
      <td style="text-align: center">
        Describing communities, collections, or shared resources
      </td>
      <td style="text-align: center">Data subject (user)</td>
    </tr>
    <tr>
      <td style="text-align: left">
        <strong>IP address</strong><br />Could be inferred: geolocation of
        connection to the service <br /><br />
      </td>
      <td style="text-align: center">Connecting users to the service</td>
      <td style="text-align: center">Data subject (user)</td>
    </tr>
    <tr>
      <td style="text-align: left">
        <strong>Details about browser and device</strong><br />Could be
        inferred: accessibility requirements <br /><br />
      </td>
      <td style="text-align: center">
        Ensuring the service is accessible to all users
      </td>
      <td style="text-align: center">Data subject (user)</td>
    </tr>
    <tr>
      <td style="text-align: left">
        <strong>Search history</strong><br />Could be inferred: political
        beliefs, religious beliefs, <br />sexuality, accessibility
        requirements <br /><br />
      </td>
      <td style="text-align: center">Improving user experience</td>
      <td style="text-align: center">Data subject (user)</td>
    </tr>
  </tbody>
</table>

`
