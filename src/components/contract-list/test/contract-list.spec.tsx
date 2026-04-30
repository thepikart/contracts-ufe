import { newSpecPage } from '@stencil/core/testing';
import { ContractList } from '../contract-list';

describe('contract-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContractList],
      html: `<contract-list></contract-list>`,
    });
    const cList = page.rootInstance as ContractList;
    const expectedContracts = cList?.contracts?.length;

    const items = page.root?.shadowRoot?.querySelectorAll("md-list-item");
    expect(items.length).toEqual(expectedContracts);
  });
});
