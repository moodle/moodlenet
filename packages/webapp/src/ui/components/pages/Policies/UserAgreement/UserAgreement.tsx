import { Trans } from '@lingui/macro'
import { CP, withCtrl } from '../../../../lib/ctrl'
import {
  MainPageWrapper,
  MainPageWrapperProps,
} from '../../../templates/MainPageWrapper'
import AccessHeader, {
  AccessHeaderProps,
} from '../../Access/AccessHeader/AccessHeader'
import './styles.scss'

export type UserAgreementProps = {
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  mainPageWrapperProps: CP<MainPageWrapperProps>
}

export const UserAgreement = withCtrl<UserAgreementProps>(
  ({ accessHeaderProps, mainPageWrapperProps }) => {
    return (
      <MainPageWrapper {...mainPageWrapperProps}>
        {/* <MainPageWrapper onKeyDown={handleKeyDown}> */}
        <AccessHeader {...accessHeaderProps} page={'login'} />
        <div className="user-agreement">
          <h1>
            <Trans>MoodleNet User Agreement</Trans>
          </h1>
          <h2>
            <Trans>1. Terms</Trans>
          </h2>
          <p>
            <Trans>
              By accessing or using this MoodleNet instance, you are agreeing to
              be bound by these terms, and all applicable laws and regulations.
              If you do not agree with any of these terms, you are prohibited
              from using or accessing this site. The software and materials
              contained in this website are protected by applicable copyright
              law and open source and creative commons licences as indicated.
            </Trans>
          </p>
          <h2>
            <Trans>2. Code of Conduct</Trans>
          </h2>
          <h3>
            <Trans>2.1 Pledge</Trans>
          </h3>
          <p>
            <Trans>
              In the interest of fostering an open and welcoming environment, we
              as users, contributors and maintainers of MoodleNet pledge to make
              participation in our project and our community a harassment-free
              experience for everyone, regardless of age, body size, disability,
              ethnicity, sex characteristics, gender identity and expression,
              level of experience, education, socio-economic status,
              nationality, personal appearance, race, religion, or sexual
              identity and orientation.
            </Trans>
          </p>
          <h3>
            <Trans>2.2 Encouraged Behaviour</Trans>
          </h3>
          <p>
            <Trans>
              Examples of behaviour that contributes to creating a positive
              environment include:
            </Trans>
          </p>
          <ul>
            <li>
              <Trans>Using welcoming and inclusive language</Trans>
            </li>
            <li>
              <Trans>
                Being respectful of differing viewpoints and experiences
              </Trans>
            </li>
            <li>
              <Trans>Gracefully accepting constructive criticism</Trans>
            </li>
            <li>
              <Trans>Focusing on what is best for the community</Trans>
            </li>
            <li>
              <Trans>Showing empathy towards other community members</Trans>
            </li>
          </ul>
          <h3>
            <Trans>2.3 Unacceptable Behaviour</Trans>
          </h3>
          <p>
            <Trans>
              Racism, sexism, homophobia, transphobia, harassment, defamation,
              doxxing, sexual depictions of children, and conduct promoting
              alt-right and fascist ideologies will not be tolerated.{' '}
            </Trans>
          </p>
          <ul>
            <li>
              <Trans>
                The use of sexualised language or imagery and unwelcome sexual
                attention or advances
              </Trans>
            </li>
            <li>
              <Trans>
                Trolling, insulting/derogatory comments, and personal or
                political attacks
              </Trans>
            </li>
            <li>
              <Trans>Public or private harassment</Trans>
            </li>
            <li>
              <Trans>
                Publishing others’ private information, such as a physical or
                electronic address, without explicit permission
              </Trans>
            </li>
            <li>
              <Trans>
                Other conduct which could reasonably be considered inappropriate
                in a professional setting
              </Trans>
            </li>
          </ul>
          <h3>
            <Trans>2.4 Responsibilities of users and contributors</Trans>
          </h3>
          <p>
            <Trans>
              Users and contributors are responsible for watching out for any
              unacceptable behaviour or content, such as harassment, and
              bringing it to moderators' attention by using the{' '}
              <a
                href="https://tracker.moodle.org/projects/MDLNET/summary"
                target="_blank"
                rel="noreferrer"
              >
                MoodleNet Tracker
              </a>{' '}
              for MoodleNet Central or by contacting the instance administrator.
            </Trans>
          </p>
          <h3>
            <Trans>
              2.5 Responsibilities of the project maintainers (such as instance
              operators, community moderators, and Moodle HQ)
            </Trans>
          </h3>
          <p>
            <Trans>
              Project maintainers, including instance operators and community
              moderators, given the relevant access, are responsible for
              monitoring and acting on flagged content and other user reports,
              and have the right and responsibility to remove, edit, or reject
              comments, communities, collections, resources, images, code, wiki
              edits, issues, and other contributions that are not aligned to
              this Code of Conduct, or to suspend or ban - temporarily or
              permanently - any contributor for breaking these terms, or for
              other behaviours that they deem inappropriate, threatening,
              offensive, or harmful.
            </Trans>
          </p>
          <p>
            <Trans>
              Instance operators should ensure that every community hosted on
              the instance is properly moderated according to the Code of
              Conduct.
            </Trans>
          </p>
          <p>
            <Trans>
              Project maintainers are responsible for clarifying the standards
              of acceptable behaviour and are expected to take appropriate and
              fair corrective action in response to any unacceptable behaviour.
            </Trans>
          </p>
          <p>
            <Trans>
              Moodle HQ does not wish to be deemed the arbiter of truth and will
              only intervene when there is an unresolved dispute.
            </Trans>
          </p>
          <h3>
            <Trans>2.6 Enforcement</Trans>
          </h3>
          <p>
            <Trans>
              All complaints must, in the first instance, be reviewed and
              investigated by project maintainers, who must provide a response
              within a reasonable time following such complaint that is deemed
              necessary and appropriate in the circumstances. Project
              maintainers are obligated to maintain confidentiality with regard
              to the reporter of an incident. Further details of specific
              enforcement policies may be posted separately.
            </Trans>
          </p>
          <p>
            <Trans>
              Project maintainers who do not follow or enforce the Code of
              Conduct in good faith may face temporary or permanent
              repercussions as determined by other maintainers of the project.
            </Trans>
          </p>
          <h3>
            <Trans>2.7 Code of Conduct Attribution</Trans>
          </h3>
          <p>
            <Trans>
              This Code of Conduct was adapted from the{' '}
              <a
                href="https://www.contributor-covenant.org/"
                target="_blank"
                rel="noreferrer"
              >
                Contributor Covenant
              </a>{' '}
              (
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer"
              >
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
            </Trans>
          </p>
          <h2>
            <Trans>
              3. Contribution, Use, Modification, and Distribution Licences
            </Trans>
          </h2>
          <ol type="a">
            <li>
              <Trans>
                Unless otherwise noted, all resources and content that you see,
                share, contribute, and/or download on this instance are made
                available under a CC-0 (Public Domain) Creative Commons License.
                This does not necessarily include links to other websites.
              </Trans>
            </li>
            <li>
              <Trans>
                MoodleNet is powered by free software, meaning that you have the
                following basic freedoms:
              </Trans>
              <ul>
                <li>
                  <Trans>
                    The freedom to run the software as you wish, for any
                    purpose.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    The freedom to study how the software works, and change it
                    so it does your computing as you wish. Access to the source
                    code is a precondition for this.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    The freedom to redistribute copies so you can help others.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    The freedom to distribute copies of your modified versions
                    to others. By doing this you can give the whole community a
                    chance to benefit from your changes.
                  </Trans>
                </li>
              </ul>
            </li>
            <li>
              <Trans>
                Permission is granted to run, study, redistribute, and
                distribute modified copies of the MoodleNet software according
                to the terms of the{' '}
                <a
                  href="https://www.gnu.org/licenses/agpl-3.0.en.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  GNU Affero Public License 3.0
                </a>{' '}
                (“AGPL”).<br></br>
                Note that this is different to the GPL license used for Moodle
                Core. The AGPL mandates that the source of your MoodleNet
                instance must be available to be downloaded even if you are
                providing a service rather than making available a binary.
                <br></br>
                Further information is available at .
                <a
                  href="https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)"
                  target="_blank"
                  rel="noreferrer"
                >
                  tl;drlegal{' '}
                </a>
              </Trans>
            </li>
          </ol>
          <h2>
            <Trans>4. Disclaimers</Trans>
          </h2>
          <h3>
            <Trans>4.1. Materials provided 'as is' </Trans>
          </h3>
          <p>
            <Trans>
              The materials on this website have been contributed by other
              users, and are provided on an 'as is' basis. Neither the site
              operator, nor Moodle Pty Ltd (“Moodle HQ”), make any warranties,
              expressed or implied. They hereby disclaim and negate all other
              warranties including, without limitation, implied warranties or
              conditions of merchantability, fitness for a particular purpose,
              or non-infringement of intellectual property or other violation of
              rights.
            </Trans>
          </p>
          <h3>
            <Trans>4.2. Accuracy</Trans>
          </h3>
          <p>
            <Trans>
              Furthermore, neither the site operator, nor Moodle HQ, make any
              representations concerning the accuracy, likely results, or
              reliability of use of the materials on this website - which may be
              incomplete or outdated, or could include technical, typographical,
              or photographic errors - or relating to such materials or on any
              sites linked from this site.
            </Trans>
          </p>
          <p>
            <Trans>
              Changes may be made to the materials contained on its website at
              any time without notice. However, neither the site operator nor
              Moodle HQ make any commitment to update the materials.{' '}
            </Trans>
          </p>
          <h3>
            <Trans>4.3. Links</Trans>
          </h3>
          <p>
            <Trans>
              Neither the site operator nor Moodle HQ have reviewed all of the
              sites linked from this website and are not responsible for the
              contents of any such linked site. The inclusion of any link does
              not imply endorsement of the site. Use of any such linked website
              is at the user's own risk.
            </Trans>
          </p>
          <h3>
            <Trans>4.4. Limitations</Trans>
          </h3>
          <p>
            <Trans>
              In no event shall the site operator, Moodle HQ, or their suppliers
              be liable for any damages (including, without limitation, damages
              for loss of data or profit, or due to business interruption)
              arising out of the use or inability to use the materials on this
              website, even if any authorized representative has been notified
              orally or in writing of the possibility of such damage. Because
              some jurisdictions do not allow limitations on implied warranties,
              or limitations of liability for consequential or incidental
              damages, these limitations may not apply to you.
            </Trans>
          </p>
          <p style={{ fontWeight: 'lighter' }}>
            <Trans>
              LIABILITY EXCLUSIONS. UNDER NO CIRCUMSTANCES WILL THE SITE
              OPERATOR, MOODLE HQ, OR THEIR SUPPLIERS BE LIABLE FOR: LOSS OF
              REVENUE; LOSS OF ACTUAL OR ANTICIPATED PROFITS; LOSS OF CONTRACTS;
              LOSS OF THE USE OF MONEY; LOSS OF ANTICIPATED SAVINGS; LOSS OF
              BUSINESS; LOSS OF OPPORTUNITY; LOSS OF GOODWILL; LOSS OF
              REPUTATION; LOSS OF, DAMAGE TO OR CORRUPTION OF DATA; OR
              CONSEQUENTIAL OR INDIRECT LOSS OR SPECIAL, PUNITIVE, OR INCIDENTAL
              DAMAGES (INCLUDING, FOR THE AVOIDANCE OF DOUBT, WHERE SUCH LOSS OR
              DAMAGE IS ALSO OF A CATEGORY OF LOSS OR DAMAGE ALREADY LISTED),
              WHETHER FORESEEABLE OR UNFORESEEABLE, BASED ON CLAIMS RELATED TO
              USE OR INABILITY TO USE THE WEBSITE, OR ARISING OUT OF ANY BREACH
              OR FAILURE OF EXPRESS OR IMPLIED WARRANTY CONDITIONS OR OTHER
              TERM, BREACH OF CONTRACT, MISREPRESENTATION, NEGLIGENCE, OTHER
              LIABILITY IN TORT, FAILURE OF ANY REMEDY TO ACHIEVE ITS ESSENTIAL
              PURPOSE, OR OTHERWISE. WHERE APPLICABLE LOCAL LAWS OVERRIDE THESE
              LIMITATIONS SUCH LAWS ARE RESTRICTED TO THE MAXIMUM EXTENT
              POSSIBLE.
            </Trans>
          </p>
          <h2>
            <Trans>5. Modifications</Trans>
          </h2>
          <p>
            <Trans>
              The site operator may revise these terms of service for its
              website at any time without notice. By using this website you are
              agreeing to be bound by the then current version of these terms.
            </Trans>
          </p>
        </div>
      </MainPageWrapper>
    )
  }
)

UserAgreement.displayName = 'UserAgreementPage'
