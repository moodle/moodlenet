import type { MainFooterProps, MinimalisticHeaderProps } from '@moodlenet/react-app/ui'
import { SimpleLayout } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import './UserAgreement.scss'

export type UserAgreementProps = {
  headerProps: MinimalisticHeaderProps
  footerProps: MainFooterProps
}

export const UserAgreement: FC<UserAgreementProps> = ({ footerProps, headerProps }) => {
  return (
    <SimpleLayout footerProps={footerProps} headerProps={headerProps}>
      {/* <MainPageWrapper onKeyDown={handleKeyDown}> */}
      <div className="user-agreement">
        <h1>MoodleNet User Agreement</h1>
        <h2>1. Terms</h2>
        <p>
          By accessing or using this MoodleNet instance, you are agreeing to be bound by these
          terms, and all applicable laws and regulations. If you do not agree with any of these
          terms, you are prohibited from using or accessing this site. The software and materials
          contained in this website are protected by applicable copyright law and open source and
          creative commons licences as indicated.
        </p>
        <h2>2. Code of Conduct</h2>
        <h3>2.1 Pledge</h3>
        <p>
          In the interest of fostering an open and welcoming environment, we as users, contributors
          and maintainers of MoodleNet pledge to make participation in our project and our community
          a harassment-free experience for everyone, regardless of age, body size, disability,
          ethnicity, sex characteristics, gender identity and expression, level of experience,
          education, socio-economic status, nationality, personal appearance, race, religion, or
          sexual identity and orientation.
        </p>
        <h3>2.2 Encouraged Behaviour</h3>
        <p>Examples of behaviour that contributes to creating a positive environment include:</p>
        <ul>
          <li>Using welcoming and inclusive language</li>
          <li>Being respectful of differing viewpoints and experiences</li>
          <li>Gracefully accepting constructive criticism</li>
          <li>Focusing on what is best for the community</li>
          <li>Showing empathy towards other community members</li>
        </ul>
        <h3>2.3 Unacceptable Behaviour</h3>
        <p>
          Racism, sexism, homophobia, transphobia, harassment, defamation, doxxing, sexual
          depictions of children, and conduct promoting alt-right and fascist ideologies will not be
          tolerated.{' '}
        </p>
        <ul>
          <li>
            The use of sexualised language or imagery and unwelcome sexual attention or advances
          </li>
          <li>Trolling, insulting/derogatory comments, and personal or political attacks</li>
          <li>Public or private harassment</li>
          <li>
            Publishing others’ private information, such as a physical or electronic address,
            without explicit permission
          </li>
          <li>
            Other conduct which could reasonably be considered inappropriate in a professional
            setting
          </li>
        </ul>
        <h3>2.4 Responsibilities of users and contributors</h3>
        <p>
          Users and contributors are responsible for watching out for any unacceptable behaviour or
          content, such as harassment, and bringing it to moderators&apos; attention by using the{' '}
          <a
            href="https://tracker.moodle.org/projects/MDLNET/summary"
            target="_blank"
            rel="noreferrer"
          >
            MoodleNet Tracker
          </a>{' '}
          for MoodleNet Central or by contacting the instance administrator.
        </p>
        <h3>
          2.5 Responsibilities of the project maintainers (such as instance operators, community
          moderators, and Moodle HQ)
        </h3>
        <p>
          Project maintainers, including instance operators and community moderators, given the
          relevant access, are responsible for monitoring and acting on flagged content and other
          user reports, and have the right and responsibility to remove, edit, or reject comments,
          communities, collections, resources, images, code, wiki edits, issues, and other
          contributions that are not aligned to this Code of Conduct, or to suspend or ban -
          temporarily or permanently - any contributor for breaking these terms, or for other
          behaviours that they deem inappropriate, threatening, offensive, or harmful.
        </p>
        <p>
          Instance operators should ensure that every community hosted on the instance is properly
          moderated according to the Code of Conduct.
        </p>
        <p>
          Project maintainers are responsible for clarifying the standards of acceptable behaviour
          and are expected to take appropriate and fair corrective action in response to any
          unacceptable behaviour.
        </p>
        <p>
          Moodle HQ does not wish to be deemed the arbiter of truth and will only intervene when
          there is an unresolved dispute.
        </p>
        <h3>2.6 Enforcement</h3>
        <p>
          All complaints must, in the first instance, be reviewed and investigated by project
          maintainers, who must provide a response within a reasonable time following such complaint
          that is deemed necessary and appropriate in the circumstances. Project maintainers are
          obligated to maintain confidentiality with regard to the reporter of an incident. Further
          details of specific enforcement policies may be posted separately.
        </p>
        <p>
          Project maintainers who do not follow or enforce the Code of Conduct in good faith may
          face temporary or permanent repercussions as determined by other maintainers of the
          project.
        </p>
        <h3>2.7 Code of Conduct Attribution</h3>
        <p>
          This Code of Conduct was adapted from the{' '}
          <a href="https://www.contributor-covenant.org/" target="_blank" rel="noreferrer">
            Contributor Covenant
          </a>{' '}
          (
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
            CC BY 4.0
          </a>
          ),{' '}
          <a
            href="https://www.contributor-covenant.org/version/1/4/code-of-conduct.html"
            target="_blank"
            rel="noreferrer"
          >
            version 1.4
          </a>
          .
        </p>
        <h2>3. Contribution, Use, Modification, and Distribution Licences</h2>
        <ol type="a">
          <li>
            Unless otherwise noted, all resources and content that you see, share, contribute,
            and/or download on this instance are made available under a CC-0 (Public Domain)
            Creative Commons License. This does not necessarily include links to other websites.
          </li>
          <li>
            MoodleNet is powered by free software, meaning that you have the following basic
            freedoms:
            <ul>
              <li>The freedom to run the software as you wish, for any purpose.</li>
              <li>
                The freedom to study how the software works, and change it so it does your computing
                as you wish. Access to the source code is a precondition for this.
              </li>
              <li>The freedom to redistribute copies so you can help others.</li>
              <li>
                The freedom to distribute copies of your modified versions to others. By doing this
                you can give the whole community a chance to benefit from your changes.
              </li>
            </ul>
          </li>
          <li>
            Permission is granted to run, study, redistribute, and distribute modified copies of the
            MoodleNet software according to the terms of the{' '}
            <a
              href="https://www.gnu.org/licenses/agpl-3.0.en.html"
              target="_blank"
              rel="noreferrer"
            >
              GNU Affero Public License 3.0
            </a>{' '}
            (“AGPL”).<br></br>
            Note that this is different to the GPL license used for Moodle Core. The AGPL mandates
            that the source of your MoodleNet instance must be available to be downloaded even if
            you are providing a service rather than making available a binary.
            <br></br>
            Further information is available at .
            <a
              href="https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)"
              target="_blank"
              rel="noreferrer"
            >
              tl;drLegal{' '}
            </a>
          </li>
        </ol>
        <h2>4. Disclaimers</h2>
        <h3>4.1. Materials provided &apos;as is&apos;</h3>
        <p>
          The materials on this website have been contributed by other users, and are provided on an
          &apos;as is&apos; basis. Neither the site operator, nor Moodle Pty Ltd (“Moodle HQ”), make
          any warranties, expressed or implied. They hereby disclaim and negate all other warranties
          including, without limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual property or other
          violation of rights.
        </p>
        <h3>4.2. Accuracy</h3>
        <p>
          Furthermore, neither the site operator, nor Moodle HQ, make any representations concerning
          the accuracy, likely results, or reliability of use of the materials on this website -
          which may be incomplete or outdated, or could include technical, typographical, or
          photographic errors - or relating to such materials or on any sites linked from this site.
        </p>
        <p>
          Changes may be made to the materials contained on its website at any time without notice.
          However, neither the site operator nor Moodle HQ make any commitment to update the
          materials.{' '}
        </p>
        <h3>4.3. Links</h3>
        <p>
          Neither the site operator nor Moodle HQ have reviewed all of the sites linked from this
          website and are not responsible for the contents of any such linked site. The inclusion of
          any link does not imply endorsement of the site. Use of any such linked website is at the
          user&apos;s own risk.
        </p>
        <h3>4.4. Limitations</h3>
        <p>
          In no event shall the site operator, Moodle HQ, or their suppliers be liable for any
          damages (including, without limitation, damages for loss of data or profit, or due to
          business interruption) arising out of the use or inability to use the materials on this
          website, even if any authorized representative has been notified orally or in writing of
          the possibility of such damage. Because some jurisdictions do not allow limitations on
          implied warranties, or limitations of liability for consequential or incidental damages,
          these limitations may not apply to you.
        </p>
        <p style={{ fontWeight: 'lighter' }}>
          LIABILITY EXCLUSIONS. UNDER NO CIRCUMSTANCES WILL THE SITE OPERATOR, MOODLE HQ, OR THEIR
          SUPPLIERS BE LIABLE FOR: LOSS OF REVENUE; LOSS OF ACTUAL OR ANTICIPATED PROFITS; LOSS OF
          CONTRACTS; LOSS OF THE USE OF MONEY; LOSS OF ANTICIPATED SAVINGS; LOSS OF BUSINESS; LOSS
          OF OPPORTUNITY; LOSS OF GOODWILL; LOSS OF REPUTATION; LOSS OF, DAMAGE TO OR CORRUPTION OF
          DATA; OR CONSEQUENTIAL OR INDIRECT LOSS OR SPECIAL, PUNITIVE, OR INCIDENTAL DAMAGES
          (INCLUDING, FOR THE AVOIDANCE OF DOUBT, WHERE SUCH LOSS OR DAMAGE IS ALSO OF A CATEGORY OF
          LOSS OR DAMAGE ALREADY LISTED), WHETHER FORESEEABLE OR UNFORESEEABLE, BASED ON CLAIMS
          RELATED TO USE OR INABILITY TO USE THE WEBSITE, OR ARISING OUT OF ANY BREACH OR FAILURE OF
          EXPRESS OR IMPLIED WARRANTY CONDITIONS OR OTHER TERM, BREACH OF CONTRACT,
          MISREPRESENTATION, NEGLIGENCE, OTHER LIABILITY IN TORT, FAILURE OF ANY REMEDY TO ACHIEVE
          ITS ESSENTIAL PURPOSE, OR OTHERWISE. WHERE APPLICABLE LOCAL LAWS OVERRIDE THESE
          LIMITATIONS SUCH LAWS ARE RESTRICTED TO THE MAXIMUM EXTENT POSSIBLE.
        </p>
        <h2>5. Modifications</h2>
        <p>
          The site operator may revise these terms of service for its website at any time without
          notice. By using this website you are agreeing to be bound by the then current version of
          these terms.
        </p>
      </div>
    </SimpleLayout>
  )
}

UserAgreement.displayName = 'UserAgreementPage'
