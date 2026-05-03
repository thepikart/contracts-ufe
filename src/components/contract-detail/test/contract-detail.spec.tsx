import { newSpecPage } from '@stencil/core/testing';
import { ContractDetail } from '../contract-detail';
import { Contract } from '../../../api/contracts';
import fetchMock from 'jest-fetch-mock';

describe('contract-detail', () => {

  const sampleContract: Contract = {
    contractNumber: 'ZML-2024-001',
    name: 'IT Support',
    partner: 'TechCorp s.r.o.',
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    budget: 50000,
    status: 'Active' as any,
    serviceType: 'IT Support' as any,
    description: 'Annual IT support contract',
  };

  let delay = async (milliseconds: number) => await new Promise<void>(resolve => {
    setTimeout(() => resolve(), milliseconds);
  });

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('shows not found message for invalid entry id', async () => {
    fetchMock.mockResponseOnce('Not Found', { status: 404 });

    const page = await newSpecPage({
      components: [ContractDetail],
      html: `<contract-detail entry-id="invalid-id" api-base="http://test/api"></contract-detail>`,
    });

    await delay(300);
    await page.waitForChanges();

    const notFound = page.root?.shadowRoot?.querySelector('.not-found');
    expect(notFound).not.toBeNull();
  });

  it('renders detail rows for a valid entry', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(sampleContract));

    const page = await newSpecPage({
      components: [ContractDetail],
      html: `<contract-detail entry-id="ZML-2024-001" api-base="http://test/api"></contract-detail>`,
    });

    await delay(300);
    await page.waitForChanges();

    const rows = page.root?.shadowRoot?.querySelectorAll('.detail-row');
    expect(rows.length).toBeGreaterThan(0);
  });
});
