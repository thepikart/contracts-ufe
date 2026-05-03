import { newSpecPage } from '@stencil/core/testing';
import { ContractList } from '../contract-list';
import { Contract } from '../../../api/contracts/models';
import fetchMock from 'jest-fetch-mock';

describe('contract-list', () => {

  const sampleContracts: Contract[] = [
    {
      contractNumber: "ZML-2024-001",
      name: "IT Support",
      partner: "TechCorp s.r.o.",
      validFrom: new Date("2024-01-01"),
      validUntil: new Date("2024-12-31"),
      budget: 50000,
      status: "Active" as any,
      serviceType: "IT Support" as any,
    },
    {
      contractNumber: "ZML-2024-002",
      name: "Cleaning Services",
      partner: "CleanPro s.r.o.",
      validFrom: new Date("2024-03-01"),
      validUntil: new Date("2025-02-28"),
      budget: 18000,
      status: "Active" as any,
      serviceType: "Cleaning" as any,
    }
  ];

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('renders sample contracts', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(sampleContracts));

    const page = await newSpecPage({
      components: [ContractList],
      html: `<contract-list api-base="http://test/api"></contract-list>`,
    });

    const contractList = page.rootInstance as ContractList;
    const expectedContracts = contractList?.contracts?.length;

    await page.waitForChanges();

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    expect(expectedContracts).toEqual(sampleContracts.length);
    expect(items.length).toEqual(expectedContracts);
  });

  it('renders error message on network issues', async () => {
    fetchMock.mockRejectOnce(new Error('Network Error'));

    const page = await newSpecPage({
      components: [ContractList],
      html: `<contract-list api-base="http://test/api"></contract-list>`,
    });

    const contractList = page.rootInstance as ContractList;
    const expectedContracts = contractList?.contracts?.length;

    await page.waitForChanges();

    const errorMessage = page.root.shadowRoot.querySelectorAll(".error");
    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    expect(errorMessage.length).toBeGreaterThanOrEqual(1);
    expect(expectedContracts).toEqual(0);
    expect(items.length).toEqual(expectedContracts);
  });
});
