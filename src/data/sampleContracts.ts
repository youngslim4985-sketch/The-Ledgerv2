import { SampleContract } from "../types";

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: "employment-agreement",
    title: "Executive Employment Agreement",
    category: "Employment",
    description: "Standard full-time executive employment contract with base compensation, equity vesting, non-compete, and confidentiality clauses.",
    summaryText: "Generally balanced employment terms, but includes a strict 24-month non-compete clause and mandatory binding arbitration.",
    defaultRiskScore: 35,
    fullText: `EXECUTIVE EMPLOYMENT AGREEMENT

This Executive Employment Agreement ("Agreement") is made effective as of July 1, 2026, by and between APEX TECHNOLOGIES INC. ("Employer") and ALEX MORGAN ("Employee").

1. DUTIES & COMPENSATION
Employee shall serve as Vice President of Operations. Employer shall pay Employee an annual base salary of $180,000, payable semi-monthly. Employee shall be eligible for a discretionary performance bonus of up to 20% of base salary annually.

2. AT-WILL EMPLOYMENT & TERMINATION
Employment is at-will. Either party may terminate employment at any time upon thirty (30) days written notice. In the event Employer terminates Employee without Cause, Employer shall pay Employee a severance amount equal to three (3) months of base salary.

3. CONFIDENTIALITY & INTELLECTUAL PROPERTY
Employee agrees that all inventions, designs, software code, customer lists, and work product developed during employment constitute "works made for hire" and belong exclusively to Employer. Employee shall maintain strict confidentiality during and after employment.

4. NON-COMPETE & NON-SOLICITATION
During employment and for a period of twenty-four (24) months following termination, Employee shall not directly or indirectly engage in or assist any business that competes with Employer within North America, nor solicit any customers or employees of Employer.

5. GOVERNING LAW & ARBITRATION
This Agreement shall be governed by Delaware law. Any dispute arising out of or relating to this Agreement shall be resolved through final and binding arbitration administered by JAMS.`,
    analysis: {
      title: "Executive Employment Agreement Analysis",
      dealType: "Employment Contract",
      riskScore: 35,
      summary: "This agreement is generally balanced with standard salary and severance protections, but contains an overly broad 24-month non-compete restriction and mandatory arbitration.",
      plainEnglishTranslation: "You are hired as VP of Operations at $180k/year. If let go without cause, you get 3 months severance. However, you cannot work for competitors in North America for 2 years after leaving, and all disputes go to private arbitration.",
      keyTerms: [
        { term: "Base Salary", value: "$180,000 / Year", impact: "Fixed annual base compensation." },
        { term: "Severance", value: "3 Months Base Salary", impact: "Guaranteed payout if terminated without cause." },
        { term: "Non-Compete Duration", value: "24 Months", impact: "Restricts working for competing companies for 2 full years." },
        { term: "Dispute Resolution", value: "Binding JAMS Arbitration", impact: "Waives jury trial rights in favor of private arbitration." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "Employer shall pay Employee an annual base salary of $180,000, payable semi-monthly. Discretionary performance bonus up to 20%.",
          plainEnglish: "Base compensation is $180,000 paid twice a month. Bonuses are optional and up to company discretion.",
          potentialConcerns: "Bonus is discretionary rather than tied to objective KPI metrics."
        },
        {
          title: "Termination",
          originalClause: "Employment is at-will. Either party may terminate upon 30 days written notice. Severance equal to 3 months salary for termination without cause.",
          plainEnglish: "Either side can end the job with 30 days notice. You receive 3 months salary if fired without cause.",
          potentialConcerns: "30-day notice is mandatory even if you resign."
        },
        {
          title: "Confidentiality",
          originalClause: "Employee shall maintain strict confidentiality during and after employment regarding inventions, code, and customer lists.",
          plainEnglish: "You cannot share company secrets, trade secrets, or customer lists during or after your employment.",
          potentialConcerns: "No expiration date on confidentiality obligations."
        },
        {
          title: "Intellectual Property",
          originalClause: "All inventions, software code, and work product developed during employment constitute works made for hire owned exclusively by Employer.",
          plainEnglish: "Anything you invent or code while working here belongs 100% to the company.",
          potentialConcerns: "Applies broadly to work done during employment hours."
        },
        {
          title: "Liability & Non-Compete",
          originalClause: "Employee shall not engage in competing business in North America for 24 months post-termination.",
          plainEnglish: "You cannot join a competitor anywhere in North America for 2 years after leaving.",
          potentialConcerns: "High risk: 24 months is extremely restrictive and may impede future employment."
        },
        {
          title: "Governing Law",
          originalClause: "Governed by Delaware law. Disputes resolved through final and binding arbitration administered by JAMS.",
          plainEnglish: "Delaware law applies, and legal fights happen in private arbitration instead of public court.",
          potentialConcerns: "Arbitration costs can be high and limit appeal rights."
        }
      ],
      yourResponsibilities: [
        "Perform VP of Operations duties in good faith.",
        "Provide 30 days written notice before resigning.",
        "Maintain confidentiality of trade secrets and customer lists perpetually.",
        "Refrain from working for direct competitors in North America for 24 months post-employment."
      ],
      otherPartyResponsibilities: [
        "Pay $180,000 annual salary in semi-monthly installments.",
        "Provide 3 months base salary severance if terminating without Cause.",
        "Provide 30 days written notice prior to termination."
      ],
      riskCards: [
        {
          title: "24-Month Non-Compete Restriction",
          explanation: "Prevents you from taking a job with any competitor in North America for 2 full years after leaving.",
          severity: "HIGH"
        },
        {
          title: "Binding JAMS Arbitration",
          explanation: "All disputes must go through private arbitration, waiving your right to a jury trial.",
          severity: "MEDIUM"
        },
        {
          title: "Discretionary Performance Bonus",
          explanation: "Bonus is up to 20% but entirely at employer discretion without guaranteed KPI targets.",
          severity: "LOW"
        }
      ],
      recommendations: [
        "Negotiate reducing the non-compete duration from 24 months down to 6-12 months.",
        "Narrow the geographic scope of the non-compete to specific direct competitors rather than all of North America.",
        "Request objective performance metrics for the annual 20% bonus.",
        "Increase severance protection to 6 months after 2 years of service."
      ],
      redFlags: [
        {
          clause: "Section 4: 24-Month Nationwide Non-Compete",
          riskLevel: "HIGH",
          explanation: "A 2-year non-compete across North America significantly limits your career mobility in your industry.",
          questionToAsk: "Can we reduce the non-compete window to 6 or 12 months and specify a list of direct competitors?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 2: Severance Protection",
          explanation: "Guarantees 3 months base salary if terminated without cause."
        }
      ],
      questionsForAttorney: [
        "Is a 24-month non-compete enforceable under Delaware law for my specific role?",
        "Can we add a list of excluded pre-existing intellectual property to Section 3?",
        "How can we ensure severance covers health insurance COBRA continuation?"
      ]
    }
  },
  {
    id: "residential-lease",
    title: "Standard Residential Lease Agreement",
    category: "Real Estate",
    description: "Residential lease contract specifying rent payment terms, security deposit, maintenance, and 60-day automatic renewal clauses.",
    summaryText: "Contains an automatic renewal clause requiring 60 days advance written notice and a strict $100 late fee penalty.",
    defaultRiskScore: 28,
    fullText: `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Lease") is entered into on August 1, 2026, between METRO PROPERTIES LLC ("Landlord") and SAM TAYLOR ("Tenant").

1. PREMISES & RENT
Landlord leases to Tenant the premises located at 742 Evergreen Terrace, Apt 4B. Tenant agrees to pay monthly rent of $2,200 on or before the 1st day of each month. A late fee of $100 shall apply to rent received after the 5th day.

2. SECURITY DEPOSIT
Tenant shall deposit $2,200 as a security deposit upon signing. Landlord shall return the security deposit, less lawful deductions for damage beyond normal wear and tear, within thirty (30) days following lease expiration.

3. LEASE TERM & AUTOMATIC RENEWAL
The initial term shall be twelve (12) months. THIS LEASE SHALL AUTOMATICALLY RENEW FOR AN ADDITIONAL 12-MONTH TERM UNLESS TENANT PROVIDES WRITTEN NOTICE OF NON-RENEWAL AT LEAST SIXTY (60) DAYS PRIOR TO EXPIRATION.

4. MAINTENANCE & REPAIRS
Tenant shall keep premises clean and sanitary. Landlord shall maintain structural components, plumbing, heating, and electrical systems. Tenant shall be responsible for repairs caused by Tenant negligence.

5. LIABILITY & INSURANCE
Tenant shall hold Landlord harmless from any injury or property damage occurring on the premises unless caused directly by Landlord's gross negligence. Tenant is required to maintain renters insurance with minimum $100,000 liability coverage.`,
    analysis: {
      title: "Standard Residential Lease Agreement Analysis",
      dealType: "Real Estate Lease",
      riskScore: 28,
      summary: "Standard residential lease with reasonable rent terms, but contains a 60-day automatic renewal clause that locks you in for another year if missed.",
      plainEnglishTranslation: "Rent is $2,200/month due on the 1st with a $100 late fee after the 5th. Crucially, you must give written notice 60 days before your lease ends, or it automatically renews for a full second year.",
      keyTerms: [
        { term: "Monthly Rent", value: "$2,200 / Month", impact: "Due on the 1st of each calendar month." },
        { term: "Security Deposit", value: "$2,200 (1 Month Rent)", impact: "Returned within 30 days of move-out." },
        { term: "Renewal Notice Window", value: "60 Days Written Notice", impact: "Must notify landlord 2 months before lease end to avoid auto-renewal." },
        { term: "Late Fee", value: "$100 after 5th of month", impact: "Fixed fee assessed on late payments." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "Monthly rent of $2,200 due on 1st. Late fee of $100 applies after 5th day.",
          plainEnglish: "Rent is $2,200 due on the 1st. You get a 4-day grace period before a $100 late fee kicks in.",
          potentialConcerns: "Late fee is flat $100 rather than percentage."
        },
        {
          title: "Termination & Renewal",
          originalClause: "Lease automatically renews for 12 months unless Tenant provides written notice 60 days prior to expiration.",
          plainEnglish: "If you don't send a letter 60 days before lease end, you are locked in for another full year.",
          potentialConcerns: "High risk: Missing the 60-day window causes automatic 1-year extension."
        },
        {
          title: "Confidentiality & Rules",
          originalClause: "Tenant shall maintain premises clean and sanitary and comply with property rules.",
          plainEnglish: "Keep the apartment clean and follow standard building rules.",
          potentialConcerns: "Standard tenant obligations."
        },
        {
          title: "Intellectual Property",
          originalClause: "N/A - Standard Residential Lease.",
          plainEnglish: "Not applicable to residential lease contracts.",
          potentialConcerns: "None."
        },
        {
          title: "Liability & Insurance",
          originalClause: "Tenant shall hold Landlord harmless for injury/damage. Renters insurance required ($100k liability).",
          plainEnglish: "Landlord is not liable for personal property damage. You must buy renters insurance.",
          potentialConcerns: "Landlord only held responsible for gross negligence."
        },
        {
          title: "Governing Law",
          originalClause: "Governed by local state and municipal residential landlord-tenant regulations.",
          plainEnglish: "Subject to standard state tenant rights laws.",
          potentialConcerns: "Ensure state security deposit return deadlines apply."
        }
      ],
      yourResponsibilities: [
        "Pay $2,200 monthly rent on or before the 1st of each month.",
        "Provide written notice of non-renewal at least 60 days before lease expiration.",
        "Maintain renters insurance policy with $100,000 liability coverage.",
        "Keep premises in clean and sanitary condition."
      ],
      otherPartyResponsibilities: [
        "Maintain structural components, heating, plumbing, and electrical systems.",
        "Return security deposit within 30 days of lease termination.",
        "Provide quiet enjoyment of premises during lease term."
      ],
      riskCards: [
        {
          title: "Automatic 12-Month Lease Renewal",
          explanation: "Renews automatically for another 12 months unless written notice is given 60 days in advance.",
          severity: "HIGH"
        },
        {
          title: "Flat $100 Late Fee Penalty",
          explanation: "Applied immediately after the 5th day of the month.",
          severity: "LOW"
        }
      ],
      recommendations: [
        "Set a calendar reminder 75 days before lease expiration to decide on renewal.",
        "Request reducing auto-renewal notice from 60 days to 30 days.",
        "Perform a detailed move-in walkthrough inspection with photos to protect your security deposit."
      ],
      redFlags: [
        {
          clause: "Section 3: Automatic 12-Month Renewal",
          riskLevel: "MEDIUM",
          explanation: "Failure to give notice exactly 60 days in advance auto-renews lease for an entire year.",
          questionToAsk: "Can we modify this to convert to month-to-month after 12 months instead of auto-renewing for a full year?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 2: 30-Day Security Deposit Return",
          explanation: "Requires landlord to return deposit within 30 days of move-out."
        }
      ],
      questionsForAttorney: [
        "Is the 60-day auto-renewal clause compliant with local tenant protection statutes?",
        "What specific deductions can landlord make from security deposit?"
      ]
    }
  },
  {
    id: "non-disclosure-agreement",
    title: "Mutual Non-Disclosure Agreement (NDA)",
    category: "General Business",
    description: "Bilateral non-disclosure agreement protecting trade secrets, business strategies, and technical specifications for 5 years.",
    summaryText: "Low overall risk. Balanced mutual protection for business discussions, but includes injunctive relief and 5-year confidentiality duration.",
    defaultRiskScore: 18,
    fullText: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of May 12, 2026, between NEXUS INNOVATIONS LLC ("Party A") and HORIZON VENTURES INC. ("Party B").

1. PURPOSE & CONFIDENTIAL INFORMATION
The parties wish to explore a potential business relationship ("Purpose"). "Confidential Information" includes technical data, software specs, trade secrets, customer data, and business strategies disclosed by either party.

2. OBLIGATIONS OF CONFIDENTIALITY
Each party shall protect the disclosing party's Confidential Information with the same degree of care it uses for its own proprietary information (not less than reasonable care), and shall not disclose Confidential Information to third parties for a period of five (5) years from disclosure.

3. EXCLUSIONS FROM CONFIDENTIALITY
Confidential Information does not include information that: (a) is or becomes publicly known through no fault of receiving party; (b) was already known prior to disclosure; or (c) is independently developed without reference to Confidential Information.

4. INJUNCTIVE RELIEF
The parties acknowledge that unauthorized disclosure of Confidential Information will cause irreparable harm. Disclosing party shall be entitled to seek injunctive relief without bond in the event of a breach.

5. TERM & TERMINATION
This Agreement remains in effect for two (2) years, provided that confidentiality obligations survive for five (5) years following termination.`,
    analysis: {
      title: "Mutual Non-Disclosure Agreement Analysis",
      dealType: "Bilateral NDA",
      riskScore: 18,
      summary: "This is a standard, mutual NDA. Both parties are equally bound to protect confidential information for 5 years with standard trade secret exclusions.",
      plainEnglishTranslation: "Both sides agree to keep shared business secrets private for 5 years while exploring a potential business partnership. Standard exceptions apply if info becomes public or was already known.",
      keyTerms: [
        { term: "Confidentiality Duration", value: "5 Years post-disclosure", impact: "Trade secrets protected for 5 years." },
        { term: "Structure", value: "Mutual (Bilateral)", impact: "Protects disclosures made by both parties equally." },
        { term: "Agreement Term", value: "2 Years", impact: "Covers disclosures made within 2 years." },
        { term: "Injunctive Relief", value: "Included", impact: "Either side can seek court order to stop unauthorized leaks." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "N/A - Non-financial information exchange agreement.",
          plainEnglish: "No monetary payments or fees involved.",
          potentialConcerns: "None."
        },
        {
          title: "Termination",
          originalClause: "Agreement term is 2 years. Confidentiality obligations survive for 5 years post-termination.",
          plainEnglish: "You can share info for 2 years. Info shared must stay secret for 5 years.",
          potentialConcerns: "Standard duration."
        },
        {
          title: "Confidentiality",
          originalClause: "Protect information with reasonable care; do not disclose to third parties for 5 years.",
          plainEnglish: "Treat confidential data with standard commercial security care.",
          potentialConcerns: "Ensure receiving party employees sign internal NDAs."
        },
        {
          title: "Intellectual Property",
          originalClause: "No license, express or implied, is granted to receiving party under any patents or copyrights.",
          plainEnglish: "Sharing information does NOT grant a license or ownership to the other side.",
          potentialConcerns: "Clean IP protection."
        },
        {
          title: "Liability & Injunction",
          originalClause: "Disclosing party entitled to seek injunctive relief without bond in event of breach.",
          plainEnglish: "If secret leaks, the owner can get an immediate court order to stop further sharing.",
          potentialConcerns: "Injunction without bond waiver."
        },
        {
          title: "Governing Law",
          originalClause: "Governed by laws of California without regard to conflict of laws principles.",
          plainEnglish: "California state law applies.",
          potentialConcerns: "Standard governing law."
        }
      ],
      yourResponsibilities: [
        "Protect received confidential information using at least reasonable care.",
        "Refrain from disclosing information to third parties for 5 years.",
        "Use confidential information strictly for evaluating the business partnership."
      ],
      otherPartyResponsibilities: [
        "Protect your confidential information with identical reasonable care.",
        "Respect standard exclusions for publicly known or independently developed data."
      ],
      riskCards: [
        {
          title: "5-Year Confidentiality Survival",
          explanation: "Obligations stay active for 5 years after disclosures end.",
          severity: "LOW"
        },
        {
          title: "Injunction Without Bond",
          explanation: "Allows disclosing party to seek immediate restraining orders without posting a cash bond.",
          severity: "LOW"
        }
      ],
      recommendations: [
        "Mark all sensitive documents explicitly as 'CONFIDENTIAL' before sharing.",
        "Confirm internal employees handling disclosures are bound by written company NDAs."
      ],
      redFlags: [],
      fairTerms: [
        {
          clause: "Section 1: Mutual Bilateral Protection",
          explanation: "Both parties bound equally by identical confidentiality rules."
        },
        {
          clause: "Section 3: Standard Exclusions",
          explanation: "Excludes publicly known and independently created information."
        }
      ],
      questionsForAttorney: [
        "Are technical trade secrets adequately protected by a 5-year limit or should trade secrets be perpetual?"
      ]
    }
  },
  {
    id: "vendor-agreement",
    title: "Corporate Vendor & Procurement Agreement",
    category: "Procurement",
    description: "Vendor supply agreement detailing Net 60 payment terms, service level agreements (SLAs), and client termination for convenience.",
    summaryText: "Medium risk for vendor. Contains long Net 60 payment terms and allows the client to terminate for convenience on 15 days notice.",
    defaultRiskScore: 52,
    fullText: `CORPORATE VENDOR & PROCUREMENT AGREEMENT

This Vendor Agreement ("Agreement") is made on June 1, 2026, between GLOBAL RETAIL CORP ("Client") and DATASTREAM SYSTEMS LLC ("Vendor").

1. SERVICES & PURCHASE ORDERS
Vendor shall supply cloud data integration services specified in individual Purchase Orders ("POs"). Services shall adhere to 99.9% Service Level Agreement (SLA) uptime.

2. PAYMENT TERMS & INVOICING
Client shall pay Vendor invoices on Net 60 payment terms following receipt of valid invoice. Late payments shall accrue interest at 1.0% per month.

3. TERMINATION FOR CONVENIENCE
Client may terminate this Agreement or any pending PO for convenience, with or without cause, at any time upon fifteen (15) days written notice to Vendor. In such event, Client's sole liability shall be payment for services delivered prior to termination date.

4. INDEMNIFICATION & INSURANCE
Vendor shall defend, indemnify, and hold Client harmless against all third-party claims arising from Vendor's breach or negligence. Vendor shall maintain Commercial General Liability insurance of at least $2,000,000.

5. LIMITATION OF LIABILITY
EXCEPT FOR INDEMNIFICATION OBLIGATIONS, NEITHER PARTY'S AGGREGATE LIABILITY SHALL EXCEED THE TOTAL FEES PAID HEREUNDER IN THE PRECEDING TWELVE (12) MONTHS.`,
    analysis: {
      title: "Corporate Vendor Agreement Analysis",
      dealType: "Vendor & Supply Contract",
      riskScore: 52,
      summary: "Moderate vendor risk due to Net 60 delayed payment terms and Client's unilateral right to terminate for convenience on 15 days notice without early exit compensation.",
      plainEnglishTranslation: "You provide cloud services under Net 60 payment terms (getting paid 2 months after invoicing). The Client can fire you anytime with 15 days notice and only pays for work done up to that date.",
      keyTerms: [
        { term: "Payment Terms", value: "Net 60 Days", impact: "Delayed cash flow; payments received 60 days after invoice." },
        { term: "SLA Guarantee", value: "99.9% Uptime", impact: "Vendor subject to credits if service drops below 99.9%." },
        { term: "Termination Right", value: "Client convenience (15 days)", impact: "Client can cancel contract quickly with 15 days notice." },
        { term: "Liability Cap", value: "12 Months Fees Paid", impact: "Standard reciprocal liability cap." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "Client shall pay Vendor invoices on Net 60 payment terms following receipt of valid invoice.",
          plainEnglish: "Client takes 60 days to pay every invoice you submit.",
          potentialConcerns: "High risk: Net 60 hurts small business cash flow."
        },
        {
          title: "Termination",
          originalClause: "Client may terminate for convenience upon 15 days written notice without penalty.",
          plainEnglish: "Client can cancel anytime for no reason with 15 days notice.",
          potentialConcerns: "Vendor gets no kill fee or unrecouped setup cost recovery."
        },
        {
          title: "Confidentiality",
          originalClause: "Standard commercial trade secret confidentiality obligations apply.",
          plainEnglish: "Keep client system architecture and data confidential.",
          potentialConcerns: "Standard scope."
        },
        {
          title: "Intellectual Property",
          originalClause: "Vendor retains proprietary software platform IP; Client owns custom reports.",
          plainEnglish: "Vendor owns core platform software; Client owns generated data.",
          potentialConcerns: "Ensure platform code ownership is clearly defined."
        },
        {
          title: "Liability & Indemnification",
          originalClause: "Vendor indemnifies Client for breach; aggregate liability capped at 12 months fees.",
          plainEnglish: "Liability is capped at 1 year of revenue, except for third-party indemnification.",
          potentialConcerns: "Carve-out from liability cap for indemnification."
        },
        {
          title: "Governing Law",
          originalClause: "Governed by New York state law.",
          plainEnglish: "New York commercial contract law applies.",
          potentialConcerns: "Standard jurisdiction."
        }
      ],
      yourResponsibilities: [
        "Deliver cloud data services adhering to 99.9% uptime SLA.",
        "Maintain $2,000,000 Commercial General Liability insurance policy.",
        "Invoice Client accurately following PO milestone completions."
      ],
      otherPartyResponsibilities: [
        "Pay valid Vendor invoices within Net 60 days.",
        "Issue Purchase Orders prior to work commencement.",
        "Provide 15 days written notice prior to terminating for convenience."
      ],
      riskCards: [
        {
          title: "Net 60 Delayed Payment Terms",
          explanation: "Forces vendor to finance operating costs for 60 days before receiving payment.",
          severity: "HIGH"
        },
        {
          title: "15-Day Termination for Convenience",
          explanation: "Client can cancel project unexpectedly with 15 days notice and zero early exit fee.",
          severity: "MEDIUM"
        }
      ],
      recommendations: [
        "Negotiate Net 30 payment terms or add a 2% discount for Net 15 payment.",
        "Require a 30-day notice for convenience termination plus a kill fee covering unrecouped setup expenses.",
        "Cap indemnity liability under Section 4 to insurance policy limits."
      ],
      redFlags: [
        {
          clause: "Section 2: Net 60 Payment Terms",
          riskLevel: "HIGH",
          explanation: "Waiting 60 days for invoice payment places significant cash flow stress on vendors.",
          questionToAsk: "Can we shorten payment terms to Net 30 or require a 25% deposit upfront?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 5: 12-Month Fees Liability Cap",
          explanation: "Protects vendor by capping total damage claims to 12 months of paid fees."
        }
      ],
      questionsForAttorney: [
        "Does the indemnification carve-out in Section 5 expose vendor to uncapped third-party liability?",
        "Can we add SLA penalty caps so credits don't exceed 10% of monthly fee?"
      ]
    }
  },
  {
    id: "service-agreement",
    title: "Master Professional Services Agreement (MSA)",
    category: "Professional Services",
    description: "Master services agreement for agency and consulting engagements covering intellectual property transfer, milestone billing, and uncapped liability carve-outs.",
    summaryText: "Balanced client-consultant MSA, but contains uncapped liability for confidentiality breaches and strict work-for-hire IP assignment.",
    defaultRiskScore: 42,
    fullText: `MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is made as of September 15, 2026, by and between APEX STUDIOS LLC ("Client") and CREATIVE DYNAMICS INC. ("Consultant").

1. SERVICES & STATEMENTS OF WORK
Consultant shall perform design and engineering services defined in executed Statements of Work ("SOW"). Each SOW shall specify project deliverables, schedule, and milestone fees.

2. INTELLECTUAL PROPERTY OWNERSHIP
Upon Client's full payment of all applicable fees, Consultant hereby assigns to Client all right, title, and interest in deliverables created under the SOW as "works made for hire." Consultant retains ownership of pre-existing tools and background IP.

3. COMPENSATION & EXPENSES
Client shall pay Consultant milestone fees within thirty (30) days of invoice date. Pre-approved travel and out-of-pocket expenses shall be reimbursed at cost.

4. WARRANTIES & DISCLAIMER
Consultant warrants that deliverables will perform substantially in accordance with SOW specifications for ninety (90) days following acceptance.

5. LIMITATION OF LIABILITY
IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES. EXCEPT FOR BREACH OF CONFIDENTIALITY OR INDEMNIFICATION, MAXIMUM AGGREGATE LIABILITY SHALL NOT EXCEED TOTAL FEES PAID UNDER THE APPLICABLE SOW.`,
    analysis: {
      title: "Master Professional Services Agreement Analysis",
      dealType: "Professional Services MSA",
      riskScore: 42,
      summary: "This is a solid professional services agreement. IP transfers to client ONLY upon full payment, and liability is capped at fees paid (except confidentiality breaches).",
      plainEnglishTranslation: "Consultant does agency work defined in SOWs. Client owns the final work product once paid in full. Consultant keeps ownership of pre-existing code and tools. Net 30 payment terms apply.",
      keyTerms: [
        { term: "IP Assignment Timing", value: "Upon Full Payment", impact: "Client doesn't get copyright ownership until invoices are paid." },
        { term: "Payment Window", value: "Net 30 Days", impact: "Standard 30-day payment timeframe." },
        { term: "Warranty Period", value: "90 Days post-acceptance", impact: "Free bug fixes for 90 days after deliverable approval." },
        { term: "Liability Cap", value: "Fees paid under SOW", impact: "Liability tied to specific project scope." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "Milestone fees payable within 30 days of invoice. Expenses reimbursed at cost.",
          plainEnglish: "Net 30 payment terms on milestone invoices. Expenses paid at cost.",
          potentialConcerns: "Ensure milestone approval criteria are clearly defined in SOW."
        },
        {
          title: "Termination",
          originalClause: "Termination provisions governed by specific SOW terms.",
          plainEnglish: "SOW dictates project termination procedures.",
          potentialConcerns: "Check individual SOWs for cancellation notice periods."
        },
        {
          title: "Confidentiality",
          originalClause: "Breach of confidentiality is explicitly carved out from liability limitation cap.",
          plainEnglish: "Uncapped financial liability if you leak confidential information.",
          potentialConcerns: "High risk: Carve-out exposes consultant to unlimited claims."
        },
        {
          title: "Intellectual Property",
          originalClause: "IP assigned as work for hire UPON FULL PAYMENT. Consultant retains pre-existing tools.",
          plainEnglish: "Client owns deliverables after paying completely. Consultant keeps background tools.",
          potentialConcerns: "Fair protection for consultant."
        },
        {
          title: "Liability & Warranties",
          originalClause: "90-day deliverable warranty. Consequential damages disclaimed; cap equal to SOW fees.",
          plainEnglish: "90-day bug fix warranty. Total damages limited to SOW contract price.",
          potentialConcerns: "Solid standard protection."
        },
        {
          title: "Governing Law",
          originalClause: "Governed by laws of New York.",
          plainEnglish: "New York state law applies.",
          potentialConcerns: "Standard jurisdiction."
        }
      ],
      yourResponsibilities: [
        "Deliver professional services according to SOW specifications and schedule.",
        "Provide 90-day warranty support for deliverables post-acceptance.",
        "Maintain confidentiality of Client technical specifications."
      ],
      otherPartyResponsibilities: [
        "Review deliverables within SOW approval timeframe.",
        "Pay milestone invoices within 30 days.",
        "Reimburse pre-approved travel and project expenses at cost."
      ],
      riskCards: [
        {
          title: "Uncapped Confidentiality Liability",
          explanation: "Liability cap under Section 5 excludes confidentiality breaches, exposing consultant to uncapped damages.",
          severity: "MEDIUM"
        },
        {
          title: "90-Day Free Bug Fix Warranty",
          explanation: "Consultant must fix deliverable bugs for 90 days post-acceptance at own expense.",
          severity: "LOW"
        }
      ],
      recommendations: [
        "Cap confidentiality breach liability to $1,000,000 or insurance policy limits rather than uncapped.",
        "Ensure every SOW includes a formal Change Order process to prevent scope creep."
      ],
      redFlags: [],
      fairTerms: [
        {
          clause: "Section 2: IP Assignment Upon Full Payment",
          explanation: "Protects consultant by holding copyright assignment until client pays in full."
        },
        {
          clause: "Section 5: Fee-Based Liability Cap",
          explanation: "Caps total damages to fees paid under the specific SOW."
        }
      ],
      questionsForAttorney: [
        "Can we add a hard ceiling to the confidentiality breach liability carve-out?",
        "Does 'background IP' definition adequately cover our proprietary code libraries?"
      ]
    }
  },
  {
    id: "recording-360-deal",
    title: "Major Label Exclusive 360 Recording Agreement",
    category: "Recording Contracts",
    description: "Standard traditional 360 record deal assigning master recordings in perpetuity with label ancillary revenue rights (merch, touring, sync).",
    summaryText: "High artist risk. The label takes 82% of master royalties, retains master ownership forever, and claims 15% of live touring and merchandise.",
    defaultRiskScore: 88,
    fullText: `EXCLUSIVE RECORDING AGREEMENT

This Exclusive Recording Agreement ("Agreement") is made and entered into as of January 15, 2026, by and between APEX SOUND MUSIC GROUP LLC ("Company") and JANE DOE p/k/a "ECHO NOVA" ("Artist").

1. GRANT OF RIGHTS & MASTER OWNERSHIP
Artist hereby grants, assigns, and transfers to Company, solely, exclusively, and perpetually throughout the Universe, all right, title, and interest in and to all sound recordings, audio-visual recordings, and performances embodied therein produced hereunder during the Term ("Master Recordings"). Company shall be deemed the author and exclusive owner of all Master Recordings from inception under "work-made-for-hire" principles.

2. TERM & OPTION PERIODS
The initial period of the Term ("Initial Period") shall commence on the date hereof and continue until twelve (12) months following the commercial release of the First Album. Artist hereby grants Company six (6) separate, consecutive, and unilateral options to extend the Term for additional periods ("Option Periods"), each requiring the delivery of one (1) full-length album.

3. ADVANCES & RECOUPMENT
Company shall pay Artist a non-returnable advance of Twenty-Five Thousand Dollars ($25,000.00) upon execution hereof. All advances, recording costs, video production expenses ($10,000 max), marketing budgets, and audit fees paid by Company shall be fully recoupable from any and all royalties payable to Artist hereunder or under any other agreement between Artist and Company ("Cross-Collateralization").

4. ROYALTY RATE & DEDUCTIONS
Company shall pay Artist a royalty of eighteen percent (18%) of Company's Net Receipts from digital streaming and physical sales. Net Receipts shall be calculated after deducting standard packaging deductions (25%), container charges, distributor fees (15%), and bad debts.

5. ANCILLARY RIGHTS (360 PROVISION)
Company shall receive fifteen percent (15%) of Artist's Gross Income from all non-recording music activities, including but not limited to live touring, concerts, merchandising, brand sponsorships, fan clubs, and acting fees.

6. AUDIT RIGHTS
Artist shall have the right, at Artist's sole expense, to inspect Company's books and records relating to Artist's royalties once per calendar year upon sixty (60) days prior written notice. Any audit must be conducted by a certified public accountant during regular business hours at Company's main office.

7. INJUNCTIVE RELIEF & NON-COMPETE
During the Term, Artist shall not render recording performances for any other person or entity, nor re-record any composition embodied in a Master Recording for a period of five (5) years following the expiration or termination of this Agreement.`,
    analysis: {
      title: "Major Label Exclusive 360 Recording Agreement Analysis",
      dealType: "Major Label 360 Agreement",
      riskScore: 88,
      summary: "This is a restrictive traditional 360 deal. The label gains perpetual ownership of all master recordings, 82% of streaming profits, and takes a 15% cut of your live touring, merch, and brand deals.",
      plainEnglishTranslation: "The label pays you $25,000 upfront, but you must pay back that $25,000 plus video and studio costs from your small 18% royalty cut before you see another dollar. The label owns your music forever and takes a cut of your live shows and merchandise.",
      keyTerms: [
        { term: "Master Ownership", value: "Perpetual (Work for Hire)", impact: "You never own your original master recordings." },
        { term: "Artist Royalty Rate", value: "18% of Net Receipts", impact: "Label keeps 82% of all streaming revenue." },
        { term: "Ancillary (360) Cut", value: "15% Gross non-recording", impact: "Label takes 15% of touring, merch, and sponsorship income." },
        { term: "Option Periods", value: "6 Unilateral Options", impact: "Label can lock you into up to 7 album cycles." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "18% royalty paid on Net Receipts after deducting 25% packaging, container charges, and 15% distro fees.",
          plainEnglish: "Label pays you 18% of streaming income after taking off 40%+ in packaging and distributor deductions.",
          potentialConcerns: "High risk: Packaging deductions on digital streams are non-existent cost inflated items."
        },
        {
          title: "Termination & Options",
          originalClause: "Initial album + 6 unilateral options exercisable solely by Company.",
          plainEnglish: "The label can force you to make up to 7 albums, while you cannot leave if unhappy.",
          potentialConcerns: "Unilateral control by record label."
        },
        {
          title: "Confidentiality & Non-Compete",
          originalClause: "5-year re-recording restriction following expiration or termination.",
          plainEnglish: "You cannot re-record any song created under this deal for 5 years after leaving.",
          potentialConcerns: "Re-recording lockout."
        },
        {
          title: "Intellectual Property",
          originalClause: "Artist assigns all right, title, and interest in Master Recordings perpetually as work-made-for-hire.",
          plainEnglish: "Label owns sound recordings forever in all territories.",
          potentialConcerns: "Perpetual master assignment."
        },
        {
          title: "Liability & 360 Cut",
          originalClause: "Company receives 15% of Gross Income from live touring, merch, brand deals, and acting.",
          plainEnglish: "Label takes 15% of your concert and t-shirt money before tour expenses are deducted.",
          potentialConcerns: "360 cut on gross income instead of net profit."
        },
        {
          title: "Governing Law & Audit",
          originalClause: "Audit rights once per year upon 60 days notice at Artist's sole expense.",
          plainEnglish: "You can hire a CPA to check royalty books once a year.",
          potentialConcerns: "Short audit window."
        }
      ],
      yourResponsibilities: [
        "Deliver 1 full-length album plus up to 6 option albums upon label request.",
        "Pay 15% gross revenue from live touring, merch, and sponsorships to label.",
        "Refrain from re-recording any song for 5 years post-termination.",
        "Recoup $25,000 advance + studio/video budgets before earning royalties."
      ],
      otherPartyResponsibilities: [
        "Pay $25,000 non-returnable advance upon signing.",
        "Fund recording and video budgets up to agreed caps.",
        "Provide annual royalty accounting statements."
      ],
      riskCards: [
        {
          title: "Perpetual Master Ownership",
          explanation: "Label owns sound recording copyrights forever; artist never recovers master rights.",
          severity: "HIGH"
        },
        {
          title: "Cross-Collateralization Debt",
          explanation: "Unrecouped debt from one album or merch deal is deducted from future album earnings.",
          severity: "HIGH"
        },
        {
          title: "15% 360 Ancillary Revenue Cut",
          explanation: "Label takes 15% of touring and merch gross income without sharing tour expenses.",
          severity: "HIGH"
        },
        {
          title: "6 Unilateral Option Periods",
          explanation: "Label holds unilateral right to keep artist locked in for up to 7 albums.",
          severity: "MEDIUM"
        }
      ],
      recommendations: [
        "Negotiate a Master Reversion clause (e.g. rights revert after 10-15 years or upon full recoupment).",
        "Cap label options to 2 album cycles maximum tied to minimum streaming/sales targets.",
        "Eliminate 360 ancillary participation or calculate 15% on NET touring profit rather than GROSS receipts.",
        "Remove 25% digital packaging deductions."
      ],
      redFlags: [
        {
          clause: "Section 1: Master Ownership in Perpetuity",
          riskLevel: "HIGH",
          explanation: "Assigning masters perpetually means you will never own your sound recordings even after all advances are recouped.",
          questionToAsk: "Can we negotiate a Master Reversion clause where rights return to the artist after 10-15 years or post-recoupment?"
        },
        {
          clause: "Section 3: Cross-Collateralization",
          riskLevel: "HIGH",
          explanation: "Unrecouped balances from album 1 can be deducted from earnings of album 2 or merch sales.",
          questionToAsk: "Can cross-collateralization between albums and non-recording income streams be strictly severed?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 6: Audit Rights",
          explanation: "Provides the right to inspect accounting books once per year upon written notice."
        }
      ],
      questionsForAttorney: [
        "How can we insert a Master Reversion clause so rights return to me after 10 years?",
        "Can we remove cross-collateralization between touring/merchandise and recording advances?",
        "Can we increase the artist royalty rate from 18% to 25-30% on digital streaming?"
      ],
      waterfallEstimates: {
        artistRoyaltyRate: 18,
        labelShareRate: 82,
        advanceAmount: 25000,
        distributionFeeRate: 15
      }
    }
  },
  {
    id: "co-publishing-deal",
    title: "Standard Music Co-Publishing Agreement",
    category: "Publishing Agreements",
    description: "50/50 Co-Publishing Agreement where publisher manages composition administration and takes 50% of the publisher's share.",
    summaryText: "Moderate risk. Publisher acquires 50% of your publishing rights in exchange for administration, sync plugging, and advance capital.",
    defaultRiskScore: 54,
    fullText: `CO-PUBLISHING AGREEMENT

This Co-Publishing Agreement is entered into on February 1, 2026, between SKYLINE MUSIC PUBLISHING INC. ("Publisher") and ALEX RIVERS ("Writer").

1. GRANT OF RIGHTS
Writer hereby assigns to Publisher an undivided fifty percent (50%) interest in all copyrights, titles, and publishing rights in and to all musical compositions written, composed, or acquired by Writer during the Term ("Compositions"). Writer retains one hundred percent (100%) of the Writer's Share of royalties.

2. ROYALTY SPLITS
Publisher shall collect all gross revenues generated from the Compositions (mechanical, sync, performance, print) and disburse income as follows:
(a) Writer's Share: 100% directly from PRO (ASCAP/BMI/SESAC) or Publisher.
(b) Publisher's Share: 50% to Publisher, 50% to Writer ("Co-Publishing Share").

3. ADVANCES & RECOUPMENT
Publisher agrees to pay Writer an advance of Fifteen Thousand Dollars ($15,000.00). All advances shall be recoupable from Writer's Co-Publishing Share and Writer's share of mechanical/sync royalties.

4. SYNC LICENSING APPROVAL
Publisher shall have the right to grant non-exclusive synchronization licenses for television, film, streaming, and commercials. Sync fees above $5,000 shall require Writer's prior written consent, not to be unreasonably withheld.`,
    analysis: {
      title: "Standard Music Co-Publishing Agreement Analysis",
      dealType: "Co-Publishing Agreement",
      riskScore: 54,
      summary: "A standard co-publishing deal where you retain 100% of your Writer's Share and 50% of the Publisher's Share (overall 75% of total publishing royalties).",
      plainEnglishTranslation: "You keep your writer's share (50% of total composition royalties). The publisher takes half of the publishing share for running administration and finding placement opportunities.",
      keyTerms: [
        { term: "Writer's Share", value: "100% (50% total composition)", impact: "Always paid directly to you by ASCAP/BMI." },
        { term: "Publisher's Share Split", value: "50% Publisher / 50% Writer", impact: "You yield 25% total composition share to publisher." },
        { term: "Advance", value: "$15,000 Recoupable", impact: "Publisher recoups advance before paying publisher share royalties." },
        { term: "Sync Approval Threshold", value: "$5,000+", impact: "You must approve sync licenses over $5,000." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "Publisher collects gross revenues and pays 100% Writer Share + 50% Publisher Share to Writer.",
          plainEnglish: "Overall you receive 75% of composition royalties (50% Writer + 25% Co-Publisher).",
          potentialConcerns: "Publisher keeps 25% total composition income."
        },
        {
          title: "Termination",
          originalClause: "Governed by term duration specified in agreement.",
          plainEnglish: "Duration publisher retains administration rights.",
          potentialConcerns: "Check if co-publishing copyright assignment is permanent."
        },
        {
          title: "Confidentiality",
          originalClause: "Standard commercial royalty accounting confidentiality.",
          plainEnglish: "Keep financial terms confidential.",
          potentialConcerns: "Standard."
        },
        {
          title: "Intellectual Property",
          originalClause: "Writer assigns undivided 50% interest in all copyrights during Term to Publisher.",
          plainEnglish: "Publisher co-owns 50% of the song copyright.",
          potentialConcerns: "Co-ownership limits future publisher switching."
        },
        {
          title: "Liability & Sync Approval",
          originalClause: "Sync fees above $5,000 require Writer's prior written consent.",
          plainEnglish: "You must approve major TV/film sync placements over $5,000.",
          potentialConcerns: "Unrestricted sync under $5,000."
        },
        {
          title: "Governing Law",
          originalClause: "Standard state music publishing regulations.",
          plainEnglish: "Governed by standard music industry contract law.",
          potentialConcerns: "None."
        }
      ],
      yourResponsibilities: [
        "Deliver agreed number of musical compositions during Term.",
        "Recoup $15,000 publishing advance from publisher's share royalties.",
        "Register compositions with PRO (ASCAP/BMI/SESAC)."
      ],
      otherPartyResponsibilities: [
        "Pay $15,000 upfront advance.",
        "Collect mechanical and sync royalties globally.",
        "Obtain writer consent for sync placements over $5,000."
      ],
      riskCards: [
        {
          title: "50% Copyright Assignment",
          explanation: "Permanently transfers half of publisher copyright ownership to publisher.",
          severity: "MEDIUM"
        },
        {
          title: "Unrestricted Sync Under $5,000",
          explanation: "Publisher can place songs in media without your approval if fee is under $5,000.",
          severity: "LOW"
        }
      ],
      recommendations: [
        "Consider an Administration Agreement instead (where publisher takes 15-20% fee without owning copyright).",
        "Require writer consent for sync placements involving sensitive brand categories (politics, alcohol)."
      ],
      redFlags: [
        {
          clause: "Section 1: Assignment of 50% Copyright",
          riskLevel: "MEDIUM",
          explanation: "Assigning half the copyright ownership permanently to publisher limits future flexibility.",
          questionToAsk: "Can we structure this as an Administration Deal instead?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 2: Writer Share Retention",
          explanation: "Writer retains 100% of Writer's share directly."
        }
      ],
      questionsForAttorney: [
        "Can we convert this from a Co-Publishing Deal to an Admin Deal with a 15% fee?",
        "What is the term duration of this agreement and when do admin rights revert?"
      ],
      waterfallEstimates: {
        artistRoyaltyRate: 75,
        labelShareRate: 25,
        advanceAmount: 15000,
        distributionFeeRate: 0
      }
    }
  },
  {
    id: "producer-spec-agreement",
    title: "Independent Producer Spec & Royalty Agreement",
    category: "Producer Agreements",
    description: "Spec producer agreement allocating 3 producer points (3%) off the master and Letter of Direction (LOD) for direct distributor payouts.",
    summaryText: "Fair artist-producer arrangement. Producer gets $2,500 advance + 3% master points paid post-recoupment via Letter of Direction.",
    defaultRiskScore: 32,
    fullText: `PRODUCER AGREEMENT & LETTER OF DIRECTION

This Producer Agreement is entered into as of March 10, 2026, between BEATSMITH PRODUCTIONS ("Producer") and MARCUS VANCE ("Artist").

1. SERVICES & PRODUCER ADVANCE
Producer agrees to produce, mix, and deliver two (2) master recordings ("Tracks"). Artist shall pay Producer a producer advance fee of Two Thousand Five Hundred Dollars ($2,500.00) per Track upon master delivery.

2. PRODUCER ROYALTY (POINTS)
Artist grants Producer a royalty equal to three percent (3%) of Net Receipts derived from the Master Recordings ("Producer Points"). Producer royalties shall be calculated on a "record one" basis after Artist has recouped recording costs at the artist royalty rate.

3. LETTER OF DIRECTION (LOD)
Artist agrees to execute a standard Letter of Direction authorizing Artist's record label or digital distributor (e.g. DistroKid, TuneCore) to pay Producer's 3% royalty directly to Producer on a quarterly basis.`,
    analysis: {
      title: "Independent Producer Spec Agreement Analysis",
      dealType: "Producer Agreement",
      riskScore: 32,
      summary: "Standard fair producer contract. Producer receives a $2,500 upfront fee per track and 3% points from master sound recording receipts.",
      plainEnglishTranslation: "You pay the producer $2,500 for producing the beat/track. Once you recoup your studio costs, the producer gets 3% of master earnings paid directly by your distributor.",
      keyTerms: [
        { term: "Upfront Fee", value: "$2,500 per Track", impact: "Fixed cost for beat production and mixing." },
        { term: "Producer Royalty", value: "3 Master Points (3%)", impact: "Producer earns 3% of master revenue." },
        { term: "Letter of Direction", value: "Included", impact: "Distributor pays producer automatically without manual calculations." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "Producer advance of $2,500 per Track + 3% Producer Points.",
          plainEnglish: "$2,500 upfront fee plus 3% master points paid post-recoupment.",
          potentialConcerns: "Fair market rate."
        },
        {
          title: "Termination",
          originalClause: "Upon master delivery and payment completion.",
          plainEnglish: "Contract fulfilled upon track delivery.",
          potentialConcerns: "None."
        },
        {
          title: "Confidentiality",
          originalClause: "Standard industry terms.",
          plainEnglish: "Keep project details private.",
          potentialConcerns: "None."
        },
        {
          title: "Intellectual Property",
          originalClause: "Master sound recording owned by Artist; Producer granted 3% points.",
          plainEnglish: "Artist owns master; producer gets 3% royalty.",
          potentialConcerns: "Solid master ownership clarity."
        },
        {
          title: "Liability & LOD",
          originalClause: "Letter of Direction signed authorizing direct distributor payment to producer.",
          plainEnglish: "Distributor sends producer's 3% directly.",
          potentialConcerns: "Streamlined automated payout."
        },
        {
          title: "Governing Law",
          originalClause: "Standard music industry contract jurisdiction.",
          plainEnglish: "Governed by local state laws.",
          potentialConcerns: "None."
        }
      ],
      yourResponsibilities: [
        "Pay $2,500 per track upfront fee upon master delivery.",
        "Sign Letter of Direction (LOD) instructing distributor to pay 3% royalty.",
        "Credit producer on all digital streaming platforms (e.g., 'Produced by BeatSmith')."
      ],
      otherPartyResponsibilities: [
        "Produce, mix, and deliver two high-quality master recordings.",
        "Provide audio stems and sample clearance warranties."
      ],
      riskCards: [
        {
          title: "Record One Recoupment",
          explanation: "Producer royalties apply retroactively from stream #1 once recording costs are recouped.",
          severity: "MEDIUM"
        }
      ],
      recommendations: [
        "Confirm whether beat contains any uncleared third-party audio samples before signing.",
        "Ensure Letter of Direction is submitted to DistroKid/TuneCore prior to release date."
      ],
      redFlags: [],
      fairTerms: [
        {
          clause: "Section 3: Letter of Direction",
          explanation: "Automates royalty payouts directly through digital distributor."
        }
      ],
      questionsForAttorney: [
        "Does the 3% producer royalty come out of artist royalty share or overall gross?",
        "Does producer retain publishing composition splits?"
      ],
      waterfallEstimates: {
        artistRoyaltyRate: 97,
        labelShareRate: 0,
        advanceAmount: 25000,
        distributionFeeRate: 0
      }
    }
  },
  {
    id: "management-deal",
    title: "Artist Management Agreement with Sunset Clause",
    category: "Management Deals",
    description: "Management representation agreement charging 20% gross commission across all entertainment earnings with a 3-year sunset clause.",
    summaryText: "High management risk if commission is on GROSS earnings. Includes a 3-year post-term sunset clause.",
    defaultRiskScore: 78,
    fullText: `ARTIST MANAGEMENT AGREEMENT

This Management Agreement ("Agreement") is made as of April 5, 2026, by and between APEX MANAGEMENT LLC ("Manager") and CHLOE BENNETT ("Artist").

1. ENGAGEMENT & SCOPE
Artist hereby engages Manager as Artist's exclusive personal manager throughout the world in the entertainment industry for a term of three (3) years.

2. MANAGER COMMISSION
Artist shall pay Manager a commission equal to twenty percent (20%) of Artist's Gross Earnings derived from all entertainment activities during the Term, including recordings, live performances, publishing, sync, acting, and brand endorsements.

3. SUNSET CLAUSE
Following the expiration or termination of the Term, Manager shall continue to receive commission on contracts entered into or negotiated during the Term as follows:
- Year 1 post-term: 20% commission
- Year 2 post-term: 15% commission
- Year 3 post-term: 10% commission

4. EXPENSE REIMBURSEMENT
Artist shall reimburse Manager for all reasonable out-of-pocket travel and promotional expenses incurred on Artist's behalf within thirty (30) days of invoice submission. Expenses exceeding $1,000 shall require Artist's prior written consent.`,
    analysis: {
      title: "Artist Management Agreement Analysis",
      dealType: "Personal Management Agreement",
      riskScore: 78,
      summary: "Manager takes 20% commission on GROSS earnings across all entertainment ventures, plus post-termination sunset commission for 3 years.",
      plainEnglishTranslation: "The manager gets 20% of every dollar you make before expenses. If a tour loses money, you still owe the manager 20% of gross ticket sales! Even after firing the manager, you must pay them sunset royalties for 3 years.",
      keyTerms: [
        { term: "Manager Commission", value: "20% of Gross Earnings", impact: "Manager takes 20% before deducting your travel, band, or production expenses." },
        { term: "Term", value: "3 Years Exclusive", impact: "You cannot switch managers during the 3-year period." },
        { term: "Sunset Clause", value: "3 Years Post-Term (20% -> 15% -> 10%)", impact: "You pay two managers simultaneously if you hire a new manager after termination." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "20% of Gross Earnings from all entertainment activities during Term.",
          plainEnglish: "Manager takes 20% of gross earnings before expenses.",
          potentialConcerns: "High risk: Commissioning gross income instead of net profit."
        },
        {
          title: "Termination & Sunset",
          originalClause: "3-year sunset clause post-term (20% -> 15% -> 10%).",
          plainEnglish: "Must continue paying manager for 3 years after firing them.",
          potentialConcerns: "Extended sunset period drains post-management income."
        },
        {
          title: "Confidentiality",
          originalClause: "Standard representation terms.",
          plainEnglish: "Keep manager advice private.",
          potentialConcerns: "Standard."
        },
        {
          title: "Intellectual Property",
          originalClause: "N/A - Management services.",
          plainEnglish: "Manager does not acquire copyright ownership.",
          potentialConcerns: "Clean."
        },
        {
          title: "Liability & Expenses",
          originalClause: "Reimburse travel expenses within 30 days. Expenses over $1,000 require consent.",
          plainEnglish: "You pay manager travel expenses, but must approve items over $1,000.",
          potentialConcerns: "Ensure expense cap is strictly enforced."
        },
        {
          title: "Governing Law",
          originalClause: "Standard entertainment management jurisdiction.",
          plainEnglish: "Governed by state entertainment law.",
          potentialConcerns: "None."
        }
      ],
      yourResponsibilities: [
        "Pay 20% commission on all gross entertainment earnings.",
        "Reimburse manager out-of-pocket travel expenses.",
        "Pay post-termination sunset royalties for 3 years."
      ],
      otherPartyResponsibilities: [
        "Provide guidance on career strategy, touring, and brand opportunities.",
        "Obtain written consent for expenses exceeding $1,000."
      ],
      riskCards: [
        {
          title: "20% Gross Income Commission",
          explanation: "Commissioning gross income leaves artists vulnerable to losses on expensive live tours.",
          severity: "HIGH"
        },
        {
          title: "3-Year Post-Termination Sunset Clause",
          explanation: "Forces artist to pay double commission if a new manager is hired post-termination.",
          severity: "HIGH"
        }
      ],
      recommendations: [
        "Calculate 20% commission on NET earnings after deducting tour operating costs.",
        "Shorten sunset clause from 3 years to 1 year max with a 10% -> 5% step-down."
      ],
      redFlags: [
        {
          clause: "Section 2: Commission on GROSS Income",
          riskLevel: "HIGH",
          explanation: "Commissioning gross income can leave artists in debt after paying tour production costs.",
          questionToAsk: "Can commission be calculated on NET earnings?"
        }
      ],
      fairTerms: [
        {
          clause: "Section 4: Expense Cap Approval",
          explanation: "Requires manager to get artist's written consent for expenses over $1,000."
        }
      ],
      questionsForAttorney: [
        "How can we insert a Key Person Clause so I can leave if my specific manager leaves?"
      ]
    }
  },
  {
    id: "distribution-agreement",
    title: "Digital Music Aggregator & Distribution Agreement",
    category: "Distribution Agreements",
    description: "Independent digital music distribution terms with 85/15 revenue split, non-exclusive term, and monthly payouts.",
    summaryText: "Artist friendly distribution deal. Artist retains 100% master ownership, distributor takes 15% fee, non-exclusive territory.",
    defaultRiskScore: 18,
    fullText: `DIGITAL MUSIC DISTRIBUTION AGREEMENT

This Agreement is made by and between VELOCITY DISTRO INC. ("Distributor") and INDEPENDENT ARTIST ("Artist").

1. DISTRIBUTION RIGHTS & MASTER RETENTION
Artist grants Distributor the non-exclusive right to distribute, stream, and monetize Artist's master sound recordings to digital service providers (Spotify, Apple Music, Amazon, YouTube, TikTok). Artist retains 100% sole ownership of all master recordings and copyrights.

2. FEES & REVENUE SHARE
Distributor shall pay Artist eighty-five percent (85%) of Net Receipts collected from digital service providers. Distributor shall retain a fifteen percent (15%) distribution fee.

3. TERM & TERMINATION
This Agreement shall run on a month-to-month basis. Artist may terminate distribution and request takedown of master recordings at any time upon thirty (30) days written notice without penalty.`,
    analysis: {
      title: "Digital Music Distribution Agreement Analysis",
      dealType: "DIY Distribution Agreement",
      riskScore: 18,
      summary: "Highly artist-friendly deal. You retain 100% of master ownership and can cancel and remove your music anytime with 30 days notice.",
      plainEnglishTranslation: "You keep full ownership of your songs. Distributor delivers your tracks to Spotify and Apple Music, takes a 15% service fee, and gives you 85% of royalties every month.",
      keyTerms: [
        { term: "Master Ownership", value: "100% Artist Retained", impact: "You own all copyrights completely." },
        { term: "Revenue Split", value: "85% Artist / 15% Distro", impact: "Clear, predictable percentage fee." },
        { term: "Term", value: "Month-to-Month (30 day takedown)", impact: "Full freedom to leave whenever you want." }
      ],
      keyClauses: [
        {
          title: "Payment Terms",
          originalClause: "Distributor pays 85% of Net Receipts collected from DSPs on monthly basis.",
          plainEnglish: "You receive 85% of streaming revenues monthly.",
          potentialConcerns: "Clear, predictable revenue share."
        },
        {
          title: "Termination",
          originalClause: "Month-to-month term. Takedown requested upon 30 days written notice without penalty.",
          plainEnglish: "Cancel anytime with 30 days notice.",
          potentialConcerns: "Flexible exit option."
        },
        {
          title: "Confidentiality",
          originalClause: "Standard account security and data protection.",
          plainEnglish: "Protect login credentials and financial account info.",
          potentialConcerns: "Standard."
        },
        {
          title: "Intellectual Property",
          originalClause: "Artist retains 100% sole ownership of all master recordings and copyrights.",
          plainEnglish: "Distributor owns zero copyright.",
          potentialConcerns: "100% artist ownership retention."
        },
        {
          title: "Liability",
          originalClause: "Non-exclusive distribution license.",
          plainEnglish: "You can use other non-exclusive distribution platforms.",
          potentialConcerns: "Non-exclusive."
        },
        {
          title: "Governing Law",
          originalClause: "Standard commercial distribution jurisdiction.",
          plainEnglish: "Standard commercial contract law.",
          potentialConcerns: "None."
        }
      ],
      yourResponsibilities: [
        "Deliver audio files, artwork, and metadata according to distributor specs.",
        "Warrant that masters do not infringe on third-party copyrights."
      ],
      otherPartyResponsibilities: [
        "Deliver audio files to Spotify, Apple Music, TikTok, YouTube.",
        "Pay 85% of collected streaming royalties on a monthly schedule.",
        "Process takedown requests within 30 days of notice."
      ],
      riskCards: [],
      recommendations: [
        "Ensure metadata and songwriter split registration with MLC/PRO is complete prior to release."
      ],
      redFlags: [],
      fairTerms: [
        {
          clause: "Section 1: 100% Ownership Retention",
          explanation: "Artist retains complete copyright and master ownership."
        },
        {
          clause: "Section 3: Flexible Termination",
          explanation: "Allows 30-day takedown request with zero penalty or exit fees."
        }
      ],
      questionsForAttorney: [
        "Are YouTube Content ID and TikTok monetization included in the 15% distribution fee?"
      ],
      waterfallEstimates: {
        artistRoyaltyRate: 85,
        labelShareRate: 0,
        advanceAmount: 0,
        distributionFeeRate: 15
      }
    }
  }
];

/**
 * The sample shown before the user uploads anything.
 *
 * The Ledger is a music rights product, so the first thing an artist sees is a
 * music contract rather than an executive employment agreement. Resolved by id
 * and not by index, so reordering the library above cannot silently change what
 * the application opens on.
 */
export const DEFAULT_SAMPLE_ID = "recording-360-deal";

export const DEFAULT_SAMPLE_INDEX: number = Math.max(
  0,
  SAMPLE_CONTRACTS.findIndex((c) => c.id === DEFAULT_SAMPLE_ID)
);

export const DEFAULT_SAMPLE: SampleContract = SAMPLE_CONTRACTS[DEFAULT_SAMPLE_INDEX];
