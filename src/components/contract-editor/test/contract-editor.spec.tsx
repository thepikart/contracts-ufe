import { newSpecPage } from '@stencil/core/testing';
import { ContractEditor } from '../contract-editor';
import fetchMock from 'jest-fetch-mock';
import { Contract } from '../../../api/contracts';

describe('contract-editor', () => {

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

  it('buttons shall be of different type', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(sampleContract));

    const page = await newSpecPage({
      components: [ContractEditor],
      html: `<contract-editor entry-id="ZML-2024-001" api-base="http://sample.test/api"></contract-editor>`,
    });

    await delay(300);
    await page.waitForChanges();

    const items: any = await page.root.shadowRoot.querySelectorAll("md-filled-button");
    expect(items.length).toEqual(1);
  });

  it('first text field is contract number', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(sampleContract));

    const page = await newSpecPage({
      components: [ContractEditor],
      html: `<contract-editor entry-id="ZML-2024-001" api-base="http://sample.test/api"></contract-editor>`,
    });

    await delay(300);
    await page.waitForChanges();

    const items: any = await page.root.shadowRoot.querySelectorAll("md-filled-text-field");
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].getAttribute("value")).toEqual(sampleContract.contractNumber);
  });
});
