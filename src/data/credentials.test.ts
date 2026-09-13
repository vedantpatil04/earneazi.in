import { describe, expect, it } from 'vitest';
import { credentials, headerCredentials, verifiedCredentials } from './credentials';
import type { Credential } from '@/types/content';

/*
  Fixtures only. The identifiers below exist to exercise the gates and are
  never rendered anywhere.
*/
function row(overrides: Partial<Credential> & Pick<Credential, 'id'>): Credential {
  return {
    label: 'A credential',
    identifierLabel: 'Identifier',
    identifier: null,
    detail: 'Context.',
    verified: false,
    ...overrides,
  };
}

const amfi = row({ id: 'amfi-arn', shortLabel: 'AMFI Registered', verified: true });
const dsa = row({ id: 'dsa', shortLabel: 'DSA Licensed', verified: true });

describe('headerCredentials', () => {
  it('carries "AMFI Registered · DSA Licensed" from the register as shipped', () => {
    expect(headerCredentials().map((credential) => credential.shortLabel)).toEqual(['AMFI Registered', 'DSA Licensed']);
  });

  it('carries AMFI then DSA, whatever order the register lists them in', () => {
    expect(headerCredentials([dsa, amfi]).map((credential) => credential.id)).toEqual(['amfi-arn', 'dsa']);
  });

  it('carries one registration on its own when only one is verified', () => {
    expect(headerCredentials([amfi, { ...dsa, verified: false }]).map((credential) => credential.id)).toEqual([
      'amfi-arn',
    ]);
  });

  it('states a verified status without needing — or inventing — an identifier', () => {
    expect(headerCredentials([amfi, dsa]).every((credential) => credential.identifier === null)).toBe(true);
  });

  it('drops a row with no short label rather than squeezing in the full claim', () => {
    expect(headerCredentials([{ ...amfi, shortLabel: undefined }, { ...dsa, shortLabel: '  ' }])).toEqual([]);
  });

  it('never promotes a credential the header does not carry', () => {
    const office = row({ id: 'place-of-business', shortLabel: 'Registered office', verified: true });
    expect(headerCredentials([office])).toEqual([]);
  });
});

describe('the ledger gate', () => {
  it('shows no ledger row until its identifier is supplied', () => {
    expect(verifiedCredentials).toEqual([]);
  });

  it('ships no invented ARN or registration number', () => {
    credentials.forEach((credential) => expect(credential.identifier).toBeNull());
  });
});
