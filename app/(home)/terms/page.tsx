import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The Stately Platform Agreement outlines the terms and conditions for using the Stately platform.',
};

export default function TermsPage() {
  return (
    <>
      <main className="min-h-screen py-24">
        <div className="container mx-auto max-w-4xl px-6 prose prose-invert prose-fd">
          <h1>Stately Platform Agreement</h1>

          <p>
            This Stately Platform Agreement (this &ldquo;
            <strong>Agreement</strong>&rdquo;) constitutes a binding agreement
            between Stately Software, Inc. (&ldquo;<strong>Stately</strong>
            &rdquo;) and you, either (i) as an individual to the extent
            you&rsquo;re accessing the Platform in your individual capacity, or
            (ii) as a company (in either situation, &ldquo;<strong>you</strong>
            &rdquo;, &ldquo;<strong>your</strong>&rdquo; or &ldquo;
            <strong>Customer</strong>&rdquo;) and governs your use of
            Stately&rsquo;s Platform (as defined below). If you are a company,
            you represent and warrant that the individual entering into this
            Agreement on your behalf is a duly authorized representative with
            the authorization to act on behalf of you and bind you to this
            Agreement. If you are an individual and are less than 18 years of
            age, your parent and/or legal guardian must agree to this Agreement
            on your behalf. Customer and Stately are referred to herein
            individually as a &ldquo;<strong>Party</strong>&rdquo; and
            collectively as the &ldquo;<strong>Parties</strong>&rdquo;.
          </p>

          <h2>1. Platform and Additional Services</h2>

          <h3>1.1 Platform License</h3>
          <p>
            Stately has developed a platform for creating, editing, and managing
            executable diagrams to visualize application logic (the &ldquo;
            <strong>Platform</strong>&rdquo;). Subject to the terms and
            conditions hereof, Stately hereby grants to Customer a limited,
            non-transferable, and non-exclusive license (the &ldquo;
            <strong>License</strong>&rdquo;) to use the Platform during the term
            hereof solely in accordance with the terms of this Agreement and any
            specifications, instructions, and documentation (collectively, the
            &ldquo;<strong>Documentation</strong>&rdquo;) provided by Stately
            from time to time. The License shall be subject to the terms and
            conditions of one or more order forms to be executed between Stately
            and Customer or other online or offline instrument used to register
            for the Platform (each, an &ldquo;<strong>Order Form</strong>
            &rdquo;). Customer shall use the Platform solely for its own
            internal business purposes and in accordance with the limitations,
            if any, set forth on an Order Form.
          </p>

          <h3>1.2 Authorized Users</h3>
          <p>
            Stately may permit you to authorize a certain number of individual
            users to access the Platform (each, an &ldquo;
            <strong>Authorized User</strong>&rdquo;). The Authorized Users will
            be able to join a &ldquo;team&rdquo; that you create on the
            Platform. You are responsible for any actions taken or omissions
            made by your Authorized Users, and ensuring their compliance with
            the terms of this Agreement.
          </p>

          <h3>1.3 Modifications to the Platform</h3>
          <p>
            Stately may modify and/or update the Platform from time to time, so
            long as such modification(s) do not materially reduce the
            Platform&rsquo;s performance or capabilities. Stately shall have no
            liability for any damage, liabilities, losses (including any loss of
            data or profits), or any other consequences that Customer, any
            Authorized Users, or any other third party may incur as a result of
            modifications to the Platform in accordance with this Section 1.3.
          </p>

          <h3>1.4 Platform Support</h3>
          <p>
            Stately will provide technical support to Customer via both
            telephone and email on weekdays during the hours of 9:00 am through
            5:00 pm Eastern Standard Time, with the exclusion of federal
            holidays (&ldquo;<strong>Platform Support Services</strong>&rdquo;).
          </p>

          <h3>1.5 Additional Services</h3>
          <p>
            During the term hereof, Stately may agree to provide Customer with
            such additional services as are set forth on any Order Forms
            executed hereunder (together with the Platform Support Services, the
            &ldquo;<strong>Additional Services</strong>&rdquo;). Except as
            specified herein or in an executed Order Form, nothing in this
            Agreement or in any Order Form shall be construed as a guarantee of
            Additional Services outside the scope of any executed Order Form.
          </p>

          <h2>2. Financial Terms</h2>

          <h3>2.1 Fees</h3>
          <p>
            In consideration for the grant of the License and the provision of
            the Additional Services, Customer shall pay to Stately the fees set
            forth in the applicable Order Form (the &ldquo;<strong>Fees</strong>
            &rdquo;) in accordance with this Section 2. Any Fees expressed in a
            fixed monthly amount may be prorated for any partial month of
            service based on the number of days the applicable Order Form was in
            effect during the month and the actual number of days in such month.
          </p>

          <h3>2.2 Payment of Fees</h3>
          <p>
            Unless otherwise indicated on an Order Form, if Customer has
            purchased a paid subscription, Customer will be required to pay Fees
            on a monthly basis. With respect to any other Fees, Customer shall
            pay such Fees within ten (10) days of receipt of an invoice from
            Stately. Payments may be satisfied via a charge to the credit card
            Customer keeps on file with Stately&rsquo;s payment processor.
            Customer hereby agrees that Stately may charge any such credit card
            for any Fees incurred by the Customer. Unless Stately states
            otherwise in writing, all amounts due and payable hereunder shall be
            paid in U.S. Dollars.
          </p>

          <h3>2.3 Interest and Taxes</h3>
          <p>
            Interest on any late payments will accrue at the rate of 1% per
            month, or the highest rate permitted by applicable law, whichever is
            lower, from the date such amount is due until the date such amount
            is paid in full. Customer will be responsible for, and will pay all
            sales and similar taxes, and all similar fees levied upon the
            provision of the Platform and the Additional Services, excluding
            only taxes based solely on Stately&rsquo;s income. Customer will
            indemnify and hold Stately harmless from and against any and all
            such taxes and related amounts levied upon the provision of the
            Platform and the Additional Services and any costs associated with
            the collection or withholding thereof, including penalties and
            interest.
          </p>

          <h3>2.4 Payment by Company or other Customer</h3>
          <p>
            If you are using the Platform as an Authorized User on behalf of a
            company Customer, or if another Customer has otherwise agreed to pay
            for you to use the Platform, then that Customer is responsible for
            paying the Fees on your behalf.
          </p>

          <h2>3. Customer Restrictions and Responsibilities</h2>

          <h3>3.1 Restrictions on Use of Platform</h3>
          <p>
            Except as expressly authorized by this Agreement, Customer may not:
          </p>
          <ol>
            <li>
              modify, disclose, alter, translate or create derivative works of
              the Platform (or any components of the foregoing);
            </li>
            <li>
              sublicense, resell, distribute, lease, rent, lend, transfer,
              assign or otherwise dispose of the Platform (or any components of
              the foregoing);
            </li>
            <li>
              reverse engineer, disassemble, decompile, decode, adapt, or
              otherwise attempt to derive or gain access to any source code,
              object code, or underlying structure, ideas, or algorithms of the
              Platform, in whole or in part;
            </li>
            <li>
              use the Platform to store or transmit any viruses, software
              routines or other code designed to permit unauthorized access, to
              disable, erase or otherwise harm software, hardware or data, or to
              perform any other harmful actions;
            </li>
            <li>
              use the Platform or Documentation in any manner or for any purpose
              that infringes, misappropriates, or otherwise violates any
              intellectual property right or other right of any person, or that
              violates any applicable Laws;
            </li>
            <li>
              interfere with or disable any features, functionality, or security
              controls of the Platform or otherwise circumvent any protection
              mechanisms for the Platform;
            </li>
            <li>copy, frame or mirror any part or content of the Platform;</li>
            <li>
              build a competitive product or service, or copy any features or
              functions of the Platform;
            </li>
            <li>
              interfere with or disrupt the integrity or performance of the
              Platform;
            </li>
            <li>
              attempt to gain unauthorized access to the Platform or related
              systems or networks;
            </li>
            <li>
              disclose to any third party any performance information or
              analysis relating to the Platform;
            </li>
            <li>
              use the components of the Platform or allow the transfer,
              transmission, export or re-export of such Platform components or
              any portion thereof in violation of any export control Laws
              administered by the U.S. Commerce Department, OFAC, or any other
              government agency;
            </li>
            <li>
              remove, alter or obscure any proprietary notices in or on the
              Platform, including any copyright notices; or
            </li>
            <li>
              cause its Authorized Users or any third party to do any of the
              foregoing.
            </li>
          </ol>
          <p>
            Customer will use its best efforts to prevent unauthorized access
            to, and use of, any passwords, and will immediately notify Stately
            in writing of any unauthorized use that comes to Customer&rsquo;s
            attention. Notwithstanding anything to the contrary in this
            Agreement, Stately may temporarily suspend or permanently revoke
            Customer&rsquo;s access to the Service if Stately determines or
            reasonably suspects that Customer or an Authorized User has or
            intends to violate, or has assisted others in violating or preparing
            to violate, any provision of this Section 3 (any such temporary
            suspension, a &ldquo;<strong>Platform Suspension</strong>&rdquo; and
            any such revocation, a &ldquo;<strong>Platform Revocation</strong>
            &rdquo;). Stately shall have no liability for any damage,
            liabilities, losses (including any loss of data or profits), or any
            other consequences that Client or any third party may incur as a
            result of a Platform Suspension or Platform Revocation, and Client
            shall not be entitled to any refunds of any Fees on account of any
            Platform Suspension or Platform Revocation. Any breach by Customer
            or an Authorized User of any provision of this Section 3 shall be a
            material breach.
          </p>

          <h3>3.2 Customer Responsibilities</h3>
          <p>
            Customer shall be solely responsible for: (a) obtaining and
            maintaining any equipment and ancillary services needed to connect
            to, access or otherwise use the Platform and the Additional
            Services; (b) maintaining the security of Customer&rsquo;s
            infrastructure, equipment, accounts, passwords (including but not
            limited to administrative and user passwords) and files; and (c)
            providing Stately and its personnel with support and system access
            needed to perform the Additional Services.
          </p>

          <h3>3.3 Age Policy</h3>
          <p>
            The Platform is not intended to be used by any person under 13 years
            of age. If you are an individual, you represent to Stately that you
            are at least 13 years old. Stately does not knowingly collect or
            solicit personally identifiable information from anyone under 13; if
            you are under 13, please do not use or attempt to use the Platform
            or send any personal information about yourself to Stately. If
            Stately learns it has collected personal information from anyone
            under 13, Stately will delete that information.
          </p>

          <h3>3.4 Inappropriate and Illegal Content Prohibited</h3>
          <p>
            Customer agrees not to transmit any inappropriate content on the
            Platform including, but not limited to, libelous, defamatory,
            obscene, pornographic, abusive, or threatening content; content that
            advocates or encourages conduct that could constitute a criminal
            offense, give rise to civil liability, or otherwise violate any
            applicable local, state, national, or foreign law or regulation;
            content that is misleading or not true; or advertise or otherwise
            solicits funds for goods or services. Stately may remove such
            content from Stately&rsquo;s servers, and Stately may suspend or
            revoke Customer&rsquo;s access to the Platform. Stately reserves the
            right to investigate, and seek applicable remedies for, violations
            of applicable law to the fullest extent of the law.
          </p>

          <h3>3.5 Your Use of Others&rsquo; Intellectual Property</h3>
          <p>
            Although you may provide information and content to Stately as part
            of your use of the Platform, you agree to be respectful of
            others&rsquo; intellectual property rights. You may not upload,
            transmit, or otherwise distribute any information or content in
            violation of intellectual property laws or proprietary rights of any
            third parties. If you do not respect a third party&rsquo;s
            intellectual property or proprietary rights, you are solely
            responsible for any violations of law. In addition, you are solely
            responsible for infringement of third party rights caused by any
            information that is generated or submitted through your use of the
            Platform. Stately takes claims of intellectual property infringement
            seriously. As such, Stately reserves the right to suspend and/or
            revoke access to the Platform for any user who is found to have
            infringed on the intellectual property rights of third parties, or
            us, or otherwise is found to have violated any intellectual property
            laws.
          </p>

          <h3>3.6 Digital Millennium Copyright Act</h3>
          <p>
            Stately reserves the right to suspend and/or terminate any
            user&rsquo;s account who is found or alleged to have infringed on
            the intellectual property rights of users, Stately, or third
            parties. In the event that you have a good faith belief that your
            intellectual property rights or the rights of someone else have been
            violated on our Platform, and you want us to delete, edit, or
            disable the material in question, you must provide us with all of
            the following information (as required by the{' '}
            <a href="http://www.copyright.gov/legislation/dmca.pdf">
              Digital Millennium Copyright Act of 1998
            </a>
            ):
          </p>
          <ol type="a">
            <li>
              a physical or electronic signature of a person authorized to act
              on behalf of the owner of the exclusive right that is allegedly
              infringed;
            </li>
            <li>
              identification of the copyrighted work claimed to have been
              infringed, or, if multiple copyrighted works are covered by a
              single notification, a representative list of such works;
            </li>
            <li>
              identification of the material that is claimed to be infringing
              and that is to be removed or access to which is to be disabled,
              and information reasonably sufficient to permit us to locate the
              material;
            </li>
            <li>
              information reasonably sufficient to permit us to contact you,
              such as an address, telephone number, and if available, an
              electronic mail address at which you may be contacted;
            </li>
            <li>
              a statement that you have a good faith belief that use of the
              material in the manner complained of is not authorized by the
              copyright owner, its agent, or the law; and
            </li>
            <li>
              a statement that the information in the notification is accurate,
              and under penalty of perjury, that you are authorized to act on
              behalf of the owner of an exclusive right that is allegedly
              infringed.
            </li>
          </ol>
          <p>
            For this notification to be effective, you must provide it to our
            designated agent at:
          </p>
          <p>
            <strong>Copyright Agent</strong>
            <br />
            Support Team &mdash;{' '}
            <a href="mailto:support@stately.ai">support@stately.ai</a>
          </p>

          <h2>4. Confidentiality</h2>

          <h3>4.1 Definition</h3>
          <p>
            &ldquo;<strong>Confidential Information</strong>&rdquo; means all
            information disclosed (whether in oral, written, or other tangible
            or intangible form) by one Party (the &ldquo;
            <strong>Disclosing Party</strong>&rdquo;) to the other Party (the
            &ldquo;<strong>Receiving Party</strong>&rdquo;) concerning or
            related to this Agreement or the Disclosing Party (whether before,
            on, or after the Effective Date) that is marked
            &ldquo;Confidential&rdquo; or &ldquo;Proprietary&rdquo; or with
            similar designation by the Disclosing Party, or that otherwise
            should reasonably be deemed to be confidential based on the context
            and nature of the information. Confidential Information includes,
            but is not limited to, computer programs in source and/or object
            code, technical drawings, algorithms, know-how, prototypes, models,
            samples, formulas, processes, ideas, inventions (whether patentable
            or not), discoveries, methods, strategies and techniques, research,
            development, design details and specifications, financial
            information, procurement and/or purchasing requirements, customer
            lists, information about investors, employees, business or
            contractual relationships, sales and merchandising data, business
            forecasts and marketing plans, and similar information.
          </p>

          <h3>4.2 Obligations</h3>
          <p>
            The Receiving Party shall maintain in confidence the Confidential
            Information during the term of this Agreement and for a period of
            two (2) years thereafter, and will not use such Confidential
            Information except as expressly permitted in this Agreement;
            provided, however, that any trade secrets shall be treated
            confidentially for so long as such information qualifies for
            protection as trade secret under applicable law. The Receiving Party
            will use the same degree of care in protecting the Confidential
            Information as the Receiving Party uses to protect its own
            confidential and proprietary information from unauthorized use or
            disclosure, but in no event less than reasonable care. Confidential
            Information will be used by the Receiving Party solely for the
            purpose of carrying out the Receiving Party&rsquo;s obligations
            under this Agreement. In addition, the Receiving Party will only
            disclose Confidential Information to its directors, officers,
            employees, contractors, and/or Authorized Users who have a need to
            know such Confidential Information in order to perform their duties
            or use the Platform under this Agreement, and only if such
            directors, officers, employees, contractors, and/or Authorized Users
            are bound by confidentiality obligations (either with Customer or
            with Stately) with respect to such Confidential Information no less
            restrictive than the non-disclosure obligations contained in this
            Section 4.2. As part of the foregoing, Stately may disclose
            Customer&rsquo;s Confidential Information to Customer&rsquo;s
            Authorized Users and to other individuals that are part of
            Customer&rsquo;s teams on the Platform. The Parties agree that
            Customer Data (as defined below) shall be considered
            Customer&rsquo;s Confidential Information and the terms and
            conditions of this Agreement will be treated as Confidential
            Information of both Parties and will not be disclosed to any third
            party; provided, however, that each Party may disclose the terms and
            conditions of this Agreement (a) to such Party&rsquo;s legal
            counsel, accountants, banks, financing sources and their advisors,
            (b) in connection with the enforcement of this Agreement or rights
            under this Agreement, or (c) in connection with an actual or
            proposed merger, acquisition, or similar transaction.
          </p>

          <h3>4.3 Exceptions</h3>
          <p>
            Notwithstanding anything to the contrary herein, Confidential
            Information will not include information that: (a) is in or enters
            the public domain without breach of this Agreement and through no
            fault of the Receiving Party; (b) the Receiving Party can reasonably
            demonstrate was in its possession prior to first receiving it from
            the Disclosing Party; (c) the Receiving Party can demonstrate was
            developed by the Receiving Party independently, and without use of
            or reference to, the Confidential Information; or (d) the Receiving
            Party receives from a third party without restriction on disclosure
            and without breach of a nondisclosure obligation. In addition, the
            Receiving Party may disclose Confidential Information that is
            required to be disclosed by applicable Laws or by a subpoena or
            order issued by a court of competent jurisdiction or other
            governmental authority (each, an &ldquo;<strong>Order</strong>
            &rdquo;), but solely on the conditions that the Receiving Party, to
            the extent permitted by applicable Laws: (i) gives the Disclosing
            Party written notice of the Order promptly after receiving it; and
            (ii) cooperates fully with the Disclosing Party before disclosure to
            provide the Disclosing Party with the opportunity to interpose any
            objections it may have to the disclosure of the information required
            by the Order and seek a protective order or other appropriate
            relief. In the event of any dispute between the Parties as to
            whether specific information is within one or more of the exceptions
            set forth in this Section 4.3, the Receiving Party will bear the
            burden of proof, by clear and convincing evidence, that such
            information is within the claimed exception(s).
          </p>

          <h3>4.4 Remedies</h3>
          <p>
            The Receiving Party acknowledges that any unauthorized disclosure of
            Confidential Information will result in irreparable injury to the
            Disclosing Party, which injury could not be adequately compensated
            by the payment of money damages. In addition to any other legal and
            equitable remedies that may be available, the Disclosing Party will
            be entitled to seek and obtain injunctive relief against any breach
            or threatened breach by the Receiving Party of the confidentiality
            obligations hereunder, from any court of competent jurisdiction,
            without being required to show any actual damage or irreparable
            harm, prove the inadequacy of its legal remedies, or post any bond
            or other security.
          </p>

          <h2>5. Intellectual Property Rights</h2>

          <h3>5.1 Generally</h3>
          <p>
            Except as specified in this Section 5, no provision of this
            Agreement shall be construed as an assignment or transfer of
            ownership of any copyrights, patents, trade secrets, trademarks, or
            any other intellectual property rights (collectively, &ldquo;
            <strong>Intellectual Property Rights</strong>&rdquo;) from either
            Party to the other.
          </p>

          <h3>5.2 Company Customers</h3>
          <p>
            If Customer is a Company, Customer owns all right, title, and
            interest in and to (i) any content that any of its Authorized Users
            submit to the Platform, including software (&ldquo;
            <strong>Submitted Content</strong>&rdquo;), and (ii) any content
            resulting specifically from its Authorized User&rsquo;s use the
            Platform, including visualizations of state machines (&ldquo;
            <strong>Created Content</strong>&rdquo;, and collectively with
            Submitted Content, the &ldquo;<strong>Customer Content</strong>
            &rdquo;).
          </p>

          <h3>5.3 Individual Customers</h3>
          <p>
            To the extent you are an individual and you are part of a team on
            the Platform with other individuals (each, a &ldquo;
            <strong>Team Collaborator</strong>&rdquo;), and the Team
            Collaborators are not the Authorized Users of a company Customer,
            you and each Team Collaborator jointly own all right, title, and
            interest in and to the Customer Content associated with that team on
            the Platform. You own all right, title, and interest in and to any
            of your Customer Content that is not submitted to the Platform for
            use by a team or created by a team.
          </p>

          <h3>5.4 Platform and Additional Services</h3>
          <p>
            As between Stately and Customer, Stately shall own and retain all
            right, title and interest in and to: (a) the name, logo, trademarks,
            and service marks (collectively, &ldquo;<strong>Marks</strong>
            &rdquo;) associated with its business; (b) the Platform and the
            Documentation; (c) all improvements, enhancements and modifications
            to the Platform; (d) any work products or deliverables resulting
            from any Additional Services provided to Customer under this
            Agreement (except for any work products or deliverables that is
            expressly set forth in an Order Form to be owned by Customer); and
            (e) all Intellectual Property Rights related to any of the
            foregoing. Stately reserves all rights in and to the Platform and
            the Documentation not expressly granted to Customer in this
            Agreement. Except for the rights and licenses expressly granted in
            this Agreement, nothing in this Agreement grants to Customer or any
            third party, by implication, waiver, estoppel, or otherwise, any
            right, title, or interest in or to the Platform.
          </p>

          <h3>5.5 Feedback</h3>
          <p>
            If Customer or any of its Authorized Users submits written
            suggestions or recommended changes to the Platform or Additional
            Services, including without limitation, new features or
            functionality relating thereto, or any comments, questions,
            suggestions, or the like (collectively, the &ldquo;
            <strong>Feedback</strong>&rdquo;), Stately is free to use such
            Feedback regardless of any other obligation or limitation between
            the Parties governing such Feedback. Customer hereby assigns to
            Stately, on Customer&rsquo;s behalf and on behalf of its Authorized
            Users and/or agents, all Intellectual Property Rights in and to the
            Feedback, for any purpose whatsoever, although Stately is not
            required to use any Feedback.
          </p>

          <h3>5.6 Use of Customer Marks</h3>
          <p>
            Customer shall own and retain all right, title and interest in and
            to the Marks relating to Customer&rsquo;s business and all
            Intellectual Property Rights related thereto.
          </p>

          <h2>6. Data</h2>

          <h3>6.1 Ownership of Customer Data</h3>
          <p>
            As between Customer and Stately, all Customer Data (as defined
            below), including any Customer Data input into the Platform by
            Customer, shall belong to Customer, provided that Stately shall have
            the right to access, use, and process such Customer Data to provide
            the Additional Services and the functionality of the Platform to
            Customer during the term of this Agreement. Customer acknowledges
            and agrees that Customer is solely responsible for any and all
            Customer Data that is input into the Platform by Customer, including
            such Customer Data&rsquo;s legality, reliability, and
            appropriateness. As used herein, &ldquo;
            <strong>Customer Data</strong>&rdquo; means Personal Data, Employee
            Personal Data and Third Party Personal Data (as such terms are
            defined below) that is uploaded by Customer.
          </p>

          <h3>6.2 Anonymized Data</h3>
          <p>
            Customer acknowledges and agrees that Stately may anonymize and
            aggregate Customer Data in a manner that it can no longer reasonably
            be used to identify individuals (&ldquo;
            <strong>Anonymized Data</strong>&rdquo;). Customer grants Stately
            and its affiliates, an unlimited, perpetual, and irrevocable license
            to use the Anonymized Data for the purpose of improving the Platform
            and Additional Services, to understand and analyze trends across
            Stately&rsquo;s customers, and for any other purpose.
          </p>

          <h3>6.3 Data Processing Agreement</h3>
          <p>
            To the extent that Customer is a company and Customer Data includes
            personal data subject to applicable data protection laws, including
            the EU General Data Protection Regulation and the California
            Consumer Privacy Act, the terms of the Data Processing Agreement
            available upon request (the &ldquo;<strong>DPA</strong>&rdquo;)
            shall govern the processing of such data. The Parties agree that
            Stately may amend the terms of the DPA from time to time to the
            extent that Stately reasonably determines that such amendment is
            necessary to comply with applicable data protection laws. The latest
            posted version of the DPA shall govern the processing of personal
            data subject to applicable data protection laws.
          </p>

          <h3>6.4 Employee and Third Party Data</h3>
          <p>
            Customer acknowledges that, as part of its use of the Platform,
            Customer may transmit Customer&rsquo;s own personal data (&ldquo;
            <strong>Personal Data</strong>&rdquo;) or the personal data of
            Employees (&ldquo;<strong>Employee Personal Data</strong>&rdquo;)
            and personal data of third parties (&ldquo;
            <strong>Third Party Personal Data</strong>&rdquo;). To the extent
            Customer transmits or inputs any Personal Data, Employee Personal
            Data or Third Party Personal Data through or into the Platform,
            Customer represents and warrants that it has obtained all legally
            required consent to capture, collect, display, input, share and
            transmit such Personal Data, Employee Personal Data and Third Party
            Personal Data into and through the Platform.
          </p>

          <h2>7. Representations, Warranties and Remedies</h2>

          <h3>7.1 Generally</h3>
          <p>
            Each Party represents and warrants that, if it is a company, (a) it
            is validly existing and in good standing under the Laws of the place
            of its establishment or incorporation, (b) it has full corporate
            power and authority to execute, deliver and perform its obligations
            under this Agreement, (c) the person signing this Agreement on its
            behalf has been duly authorized and empowered to enter into this
            Agreement, and (d) this Agreement is valid, binding and enforceable
            against it in accordance with its terms, except to the extent
            limited under Laws relating to insolvency, bankruptcy, and the like.
          </p>

          <h3>7.2 Stately&rsquo;s Representations and Warranties</h3>
          <p>
            Stately represents and warrants that (a) the Platform will conform,
            in all material respects, to the Documentation and any other
            specifications set forth in the applicable Order Form, and (b) it
            will perform the Additional Services, if any, in a professional and
            workmanlike manner.
          </p>

          <h3>7.3 Customer&rsquo;s Representations and Warranties</h3>
          <p>
            Customer represents and warrants that Customer: (a) will use the
            Platform and the Additional Services only in compliance with this
            Agreement and all applicable local, state, federal and international
            laws and regulations, rules, orders, and ordinances (collectively,
            &ldquo;<strong>Laws</strong>&rdquo;); and (b) shall not infringe
            upon any third party&rsquo;s Intellectual Property Rights in its use
            of the Platform and the Additional Services.
          </p>

          <h3>7.4 Disclaimer</h3>
          <p className="uppercase">
            The Platform and Additional Services are provided
            &ldquo;as-is&rdquo; and &ldquo;as-available.&rdquo; Except as
            expressly set forth in this Agreement, Stately disclaims any and all
            representations or warranties (express or implied, oral or written)
            with respect to the Platform and the Additional Services provided
            under this Agreement, whether alleged to arise by operation of law,
            by reason of custom or usage in the trade, by course of dealing or
            otherwise, including any and all: (a) warranties of merchantability;
            (b) warranties of fitness or suitability for any purpose (whether or
            not Stately knows, has reason to know, has been advised, or is
            otherwise aware of any such purpose); and (c) warranties of
            noninfringement or condition of title.
          </p>

          <h2>8. Indemnification Obligations</h2>

          <h3>8.1 Stately Indemnity</h3>
          <p>
            Stately, at its sole expense, will defend Customer and its
            affiliates, directors, officers, employees, and agents (&ldquo;
            <strong>Customer Indemnitees</strong>&rdquo;) from and against
            third-party claims, suits, actions or proceedings (each a &ldquo;
            <strong>Claim</strong>&rdquo;) and indemnify Customer from any
            related damages, payments, deficiencies, fines, judgments,
            settlements, liabilities, losses, costs, and expenses (including,
            but not limited to, reasonable attorneys&rsquo; fees, costs,
            penalties, interest and disbursements) (collectively, &ldquo;
            <strong>Losses</strong>&rdquo;) that are awarded by a court of
            competent jurisdiction or included in a settlement approved, in
            advance and in writing, by Stately to the extent arising from or
            relating to (a) a Claim that the Platform infringes the Intellectual
            Property Rights of any third party, (b) any negligence or willful
            misconduct by Stately, or (c) any alleged or actual breach of
            Stately&rsquo;s representations, warranties and obligations under
            this Agreement.
          </p>
          <p>
            In the event of a Claim pursuant to Section 8.1(a), Stately may, at
            its option and expense (i) obtain for Customer the right to continue
            to exercise the rights granted to Customer under this Agreement;
            (ii) substitute the allegedly infringing component for an equivalent
            non-infringing component; or (iii) modify the Platform to make it
            non-infringing. If none of subparts (i), (ii), or (iii) in the
            foregoing sentence are obtainable on commercially reasonable terms,
            Stately may terminate this Agreement, effective immediately, by
            written notice to Customer. Upon a termination of this Agreement
            pursuant to this Section 8.1, Customer must cease using the Platform
            and Stately will refund the Fees Customer paid to Stately for the
            Platform adjusted pro-rata for any period during the Term when the
            Platform was provided to Customer.
          </p>
          <p>
            Stately indemnification obligations do not extend to Claims arising
            from or relating to: (i) any negligent or willful misconduct of
            Customer Indemnitees; (ii) any combination of the Platform (or any
            portion thereof) by Customer Indemnitees with any equipment,
            software, data (including Customer Data or Customer Content) or any
            other materials not approved by Stately; (iii) any modification to
            the Platform by Customer Indemnitees not expressly authorized by
            Stately; (iv) the use of the Platform by Customer Indemnitees in a
            manner contrary to the terms of this Agreement where the
            infringement would not have occurred but for such use; (v) the
            continued use of the Platform after Stately has provided
            substantially equivalent non-infringing software or services; or
            (vi) any Customer services or products.
          </p>

          <h3>8.2 Customer Indemnity</h3>
          <p>
            Customer, at its sole expense, will defend Stately and its
            affiliates, directors, officers, employees, and agents (&ldquo;
            <strong>Stately Indemnitees</strong>&rdquo;) from and against any
            third-party Claim and indemnify Stately Indemnitees from any related
            Losses to the extent arising from or relating to (a) any negligence
            or willful misconduct by Customer or its Authorized Users,
            affiliates, directors, officers, employees, or agents, or any other
            party acting on Customer&rsquo;s behalf (the &ldquo;
            <strong>Customer Indemnity Parties</strong>&rdquo;); (b) any alleged
            or actual breach of Customer&rsquo;s representations, warranties and
            obligations under this Agreement; (c) the use of the Platform by
            Customer Indemnity Parties, including without limitation any claim
            by Customer&rsquo;s employees or agents related to the use of the
            Platform by Customer Indemnity Parties; and (d) any violation of
            applicable Laws and Orders by Customer Indemnity Parties.
          </p>

          <h3>8.3 Procedures</h3>
          <p>
            The obligations of each party to indemnify the other party pursuant
            to Section 8 are conditioned upon the indemnified party: (a) giving
            prompt written notice of the Claim to the indemnifying party once
            the indemnified party becomes aware of the Claim (provided that
            failure to provide prompt written notice to the indemnifying party
            will only alleviate an indemnifying party&rsquo;s obligations under
            Section 8 to the extent that any associated delay materially
            prejudices or impairs the defense of the related Claims); (b)
            granting the indemnifying party the option to take sole control of
            the defense (including granting the indemnifying party the right to
            select and use counsel of its own choosing) and settlement of the
            Claim (except that the indemnified party&rsquo;s prior written
            approval will be required for any settlement that reasonably can be
            expected to require an affirmative obligation of the indemnified
            party); and (c) providing reasonable cooperation to the indemnifying
            party and, at the indemnifying party&rsquo;s request and expense,
            assistance in the defense or settlement of the Claim.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p className="uppercase">
            To the extent permitted by applicable law, (a) neither party will be
            liable for any loss of profits or any indirect, special, incidental,
            reliance or consequential damages of any kind, regardless of the
            form of action, whether in contract, tort (including negligence),
            strict liability or otherwise, even if informed of the possibility
            of such damages in advance; and (b) except for Customer&rsquo;s
            obligation to pay the Fees, a breach of Section 4 (Confidentiality)
            or Section 5 (Intellectual Property Rights), and Customer&rsquo;s
            indemnification obligations as set forth in Section 8, each
            party&rsquo;s aggregate liability to the other party will not exceed
            the Fees actually paid by Customer to Stately during the twelve (12)
            month period immediately preceding the event which gave rise to such
            liability.
          </p>

          <h2>10. Term, Termination and Effect of Termination</h2>

          <h3>10.1 Term</h3>
          <p>
            This Agreement commences upon the Effective Date and continues in
            effect until the expiration of the period specified in the Order
            Form, unless terminated earlier in accordance with Section 10.2 (the
            &ldquo;<strong>Initial Term</strong>&rdquo;). Thereafter, this
            Agreement will automatically renew for successive terms of
            equivalent duration (each, a &ldquo;<strong>Renewal Term</strong>
            &rdquo;, and collectively with the Initial Term, the &ldquo;
            <strong>Term</strong>&rdquo;).
          </p>

          <h3>10.2 Termination</h3>
          <p>
            Either Party may terminate this Agreement at any time. If you would
            like to terminate this Agreement, you may do so by accessing your
            account.
          </p>
          <p>
            Either Party may also terminate this Agreement as follows: (a) if
            the other Party materially breaches this Agreement (including,
            without limitation, in the case of Customer, nonpayment of the Fees)
            and does not remedy such failure within thirty (30) days after its
            receipt of written notice of such breach (unless the breach is of a
            nature that is incapable of being cured, in which case the
            non-breaching Party may terminate this Agreement immediately upon
            written notice); (b) if the other Party terminates its business
            activities or becomes insolvent, admits in writing to inability to
            pay its debts as they mature, makes an assignment for the benefit of
            creditors, or becomes subject to direct control of a trustee,
            receiver or similar authority; (c) if another Customer has agreed to
            pay the Fees for your use of the Platform, and the other Customer
            fails to pay any of the Fees for you; (d) if you are an Authorized
            User of another Customer and the other Customer ceases to have an
            active agreement with Stately; or (e) as otherwise expressly set
            forth in this Agreement or an Order Form.
          </p>

          <h3>10.3 Effect of Termination</h3>
          <p>
            Upon any termination of this Agreement: (a) the License and any
            other rights granted to Customer under this Agreement with respect
            to the Platform and the Additional Services will immediately cease;{' '}
            <em>provided</em>, <em>however</em>, to the extent that Customer
            terminates this Agreement pursuant to Section 10.2, Customer will
            continue to have access to the Platform and the Additional Services
            for the remainder of such portion of the Initial Term or Renewal
            Term, as applicable, for which Customer has prepaid the applicable
            Fees, and Customer shall not be eligible to receive a refund of such
            prepaid Fees, (b) Customer shall immediately pay to Stately all
            amounts due and payable up to and through the effective date of
            termination, and (c) the Receiving Party will, at the option of the
            Disclosing Party, promptly return to the Disclosing Party or destroy
            all Confidential Information of Disclosing Party then in the
            Receiving Party&rsquo;s possession. Notwithstanding any terms to the
            contrary in this Agreement, any provision of this Agreement that, by
            its nature and context, is intended to survive this Agreement
            (including, without limitation, Customer&rsquo;s obligation to pay
            any unpaid Fees and Sections 4 through 6, 7.4, and 8 through 11
            inclusive) will survive any termination of this Agreement.
          </p>

          <h2>11. General Provisions</h2>

          <h3>11.1 Entire Agreement</h3>
          <p>
            This Agreement, including all exhibits to this Agreement, all of
            which are incorporated herein by reference, sets forth the entire
            agreement and understanding of the Parties relating to the subject
            matter hereof, and supersedes all prior or contemporaneous
            agreements, proposals, negotiations, conversations, discussions and
            understandings, written or oral, with respect to such subject matter
            and all past dealing or industry custom.
          </p>

          <h3>11.2 Independent Contractors</h3>
          <p>
            Neither Party will, for any purpose, be deemed to be an agent,
            franchisor, franchise, employee, representative, owner or partner of
            the other Party, and the relationship between the Parties will only
            be that of independent contractors. Neither Party will have any
            right or authority to assume or create any obligations or to make
            any representations or warranties on behalf of any other Party,
            whether express or implied, or to bind the other Party in any
            respect whatsoever.
          </p>

          <h3>11.3 Dispute Resolution</h3>
          <p>
            The Parties agree to resolve any dispute, claim or controversy
            arising out of or relating to this Agreement according to the terms
            of this Section 11.3. First, the Parties agree to attempt in good
            faith to resolve the dispute through informal resolution. Second, if
            the dispute is not resolved through informal resolution, the Parties
            agree to participate in binding arbitration administered by the
            American Arbitration Association under its Commercial Arbitration
            Rules in Orlando, Florida. The Parties agree that, in the event of
            arbitration (or in the event of a lawsuit if this arbitration clause
            is deemed invalid or does not apply to a given dispute) the
            prevailing Party shall be entitled to costs and fees (including
            reasonable attorneys&rsquo; fees). Either Party may bring a lawsuit
            solely for injunctive relief without first engaging in the dispute
            resolution process described in this Section 11.3. In the event that
            the dispute resolution procedures in this Section 11.3 are found not
            to apply to a given claim, or in the event of a claim for injunctive
            relief as specified in the previous sentence, the Parties agree that
            any judicial proceeding will be brought in the state courts of
            Orlando, Florida. Both Parties consent to venue and personal
            jurisdiction there.
          </p>
          <p className="uppercase">
            All claims must be brought in the parties&rsquo; individual
            capacity, and not as a plaintiff or class member in any purported
            class or representative proceeding, and, unless agreed to otherwise
            by the parties, the arbitrator may not consolidate more than one
            person&rsquo;s claims.
          </p>

          <h3>11.4 Governing Law</h3>
          <p>
            The validity, interpretation, construction and performance of this
            Agreement, and all acts and transactions pursuant hereto and the
            rights and obligations of the Parties hereto shall be governed,
            construed and interpreted in accordance with the laws of the State
            of Florida, without giving effect to principles of conflicts of law.
          </p>

          <h3>11.5 Assignment</h3>
          <p>
            Neither this Agreement nor any right or duty under this Agreement
            may be transferred, assigned or delegated by either Party, by
            operation of applicable Laws or otherwise, without the prior written
            consent of other Party, and any attempted transfer, assignment or
            delegation without such consent will be void and without effect.
            Notwithstanding the foregoing, either Party may assign its rights
            and obligations hereunder in connection with a merger,
            reorganization, consolidation, or sale of all or substantially all
            of its assets. Subject to the foregoing, this Agreement will be
            binding upon, and will inure to the benefit of, the Parties and
            their respective representatives, heirs, administrators, successors
            and permitted assigns.
          </p>

          <h3>11.6 Amendments and Waivers</h3>
          <p>
            Stately reserves the right to change the terms of this Agreement
            from time to time, with or without notice to you. Any changes to
            this Agreement will become effective on the &ldquo;Effective
            Date&rdquo; indicated above. If you continue to use the Platform or
            Additional Services after such date, you consent to the new terms of
            the Agreement. No failure or delay (in whole or in part) on the part
            of a Party to exercise any right or remedy hereunder will operate as
            a waiver thereof or effect any other right or remedy. All rights and
            remedies hereunder are cumulative and are not exclusive of any other
            rights or remedies provided hereunder or by applicable Laws. The
            waiver of one breach or default or any delay in exercising any
            rights will not constitute a waiver of any subsequent breach or
            default.
          </p>

          <h3>11.7 Notices</h3>
          <p>
            Any notice made pursuant to this Agreement will be in writing and
            will be deemed delivered on (a) the date of delivery if delivered
            personally, (b) five (5) calendar days (or upon written confirmed
            receipt) after mailing if duly deposited in registered or certified
            mail or express commercial carrier, or (c) one (1) calendar day (or
            upon written confirmed receipt) after being sent by email, addressed
            to Customer or to Stately, as the case may be, at the address or
            email address as may be hereafter designated by either Party. Any
            notice to Customer pertaining to an Order Form may be made by
            Stately to the contact listed by Customer for such purpose in the
            applicable Order Form.
          </p>

          <h3>11.8 Severability</h3>
          <p>
            If any provision of this Agreement is invalid, illegal, or incapable
            of being enforced by any rule of law or public policy, all other
            provisions of this Agreement will nonetheless remain in full force
            and effect. Upon such determination that any provision is invalid,
            illegal, or incapable of being enforced, the Parties will negotiate
            in good faith to modify this Agreement so as to effect the original
            intent of the Parties as closely as possible in an acceptable manner
            to the end that the transactions contemplated hereby are fulfilled.
          </p>

          <h3>11.9 Counterparts</h3>
          <p>
            This Agreement may be executed: (a) in two or more counterparts,
            each of which will be deemed an original and all of which will
            together constitute the same instrument; and (b) by the Parties by
            exchange of signature pages by mail, facsimile or email (if email,
            signatures in Adobe PDF or similar format).
          </p>

          <h3>11.10 Force Majeure</h3>
          <p>
            Neither Party will be responsible for any failure to perform or
            delay attributable in whole or in part to any cause beyond its
            reasonable control including, but not limited to, natural disasters
            (fire, storm, floods, earthquakes, etc.), a pandemic, acts of
            terrorism, civil disturbances, disruption of telecommunications,
            disruption of power or other essential services, interruption or
            termination of any third party services, labor disturbances,
            vandalism, cable cut, computer viruses or other similar occurrences,
            or any malicious or unlawful acts of any third party.
          </p>

          <h3>11.11 Construction</h3>
          <p>
            This Agreement shall be deemed to be the product of all of the
            Parties, and no ambiguity shall be construed in favor of or against
            any one of the Parties.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
