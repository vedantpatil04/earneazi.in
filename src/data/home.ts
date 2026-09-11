import type { TrustPrinciple, ProcessStep, BankingPartner } from '@/types/content';

export interface TrustHighlight {
  label: string;
  value: string;
  description: string;
}

export const trustHighlights: TrustHighlight[] = [
  {
    label: 'Regulatory Trust',
    value: 'AMFI Registered',
    description: 'Mutual Fund Distributor operating under official code of conduct and transparency.',
  },
  {
    label: 'Lending Reach',
    value: '20+ Partner Banks',
    description: 'Licensed DSA channel securing competitive terms from premier financial institutions.',
  },
  {
    label: 'Combined Advisory',
    value: '16 Years',
    description: 'Deep advisory background across wealth, insurance, and banking in Karnataka.',
  },
  {
    label: 'Local Roots',
    value: 'Belagavi, KA',
    description: 'Dedicated office at Amrut Empire, Ganeshpur with doorstep and digital consultation.',
  },
];

export const trustPrinciples: TrustPrinciple[] = [
  {
    id: 'fiduciary-first',
    title: 'Goal-First, Product-Second',
    description:
      'We never push products to chase monthly quotas. Every mutual fund, policy, or loan is vetted strictly against your timeline and risk appetite.',
    iconName: 'Scale',
  },
  {
    id: 'unified-strategy',
    title: 'Unified Financial Architecture',
    description:
      'Wealth creation, risk protection, and borrowing should never exist in silos. We orchestrate all three pillars under a single clear roadmap.',
    iconName: 'Sparkles',
  },
  {
    id: 'direct-access',
    title: 'Direct Access to Senior Advisors',
    description:
      'No frustrating call centers or chatbot loops. You work directly with experienced founders Abhishek Sharma and Anil Souza.',
    iconName: 'Users',
  },
  {
    id: 'regulatory-rigor',
    title: 'Transparent & Compliant',
    description:
      'AMFI-compliant distribution, zero hidden consultation fees, and complete disclosure on scheme risk classifications.',
    iconName: 'CheckCircle',
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: '30-Minute Discovery',
    description:
      'A calm, confidential discussion (in-person or over video/phone) to map your current assets, liabilities, and core life milestones.',
    highlight: 'Zero pressure, no upfront fees',
  },
  {
    number: '02',
    title: 'Bespoke Blueprint',
    description:
      'We craft an actionable roadmap combining disciplined SIP investments, essential safety cushions, and debt optimization.',
    highlight: 'Customized asset allocation',
  },
  {
    number: '03',
    title: 'Seamless Onboarding',
    description:
      'We handle 100% of the KYC, documentation, and operational paperwork so your SIP, policy, or loan is activated cleanly.',
    highlight: 'Assisted digital execution',
  },
  {
    number: '04',
    title: 'Ongoing Stewardship',
    description:
      'Markets change, and life moves. We conduct structured periodic reviews to rebalance portfolios and maintain your course.',
    highlight: 'Long-term partnership',
  },
];

export const bankingPartners: BankingPartner[] = [
  { name: 'State Bank of India', tagline: 'National Public Sector' },
  { name: 'HDFC Bank', tagline: 'Private Retail Leader' },
  { name: 'ICICI Bank', tagline: 'Comprehensive Credit' },
  { name: 'Axis Bank', tagline: 'Retail & MSME' },
  { name: 'Kotak Mahindra Bank', tagline: 'Competitive Home Loans' },
  { name: 'Bank of Baroda', tagline: 'Public Banking' },
  { name: 'Canara Bank', tagline: 'Priority Lending' },
  { name: 'Punjab National Bank', tagline: 'Commercial & Retail' },
  { name: 'Union Bank of India', tagline: 'Secured Facilities' },
];

export const contactDetails = {
  phonePrimary: '+91 87921 51022',
  phoneSecondary: '+91 91087 26913',
  email: 'earneazi01@gmail.com',
  address: 'Office No. 101, Amrut Empire, Ganeshpur, Belagavi (Belgaum), Karnataka – 591108',
  workingHours: 'Monday – Saturday: 9:00 AM – 7:00 PM',
  whatsappUrl: 'https://wa.me/918792151022?text=Hello%20Earneazi%2C%20I%20would%20like%20to%20schedule%20a%20free%20financial%20consultation.',
};
