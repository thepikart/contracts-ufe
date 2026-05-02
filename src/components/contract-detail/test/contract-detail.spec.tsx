import { newSpecPage } from '@stencil/core/testing';
import { ContractDetail } from '../contract-detail';

describe('contract-detail', () => {
  it('shows not found message for invalid entry id', async () => {
    const page = await newSpecPage({
      components: [ContractDetail],
      html: `<contract-detail entry-id="9999"></contract-detail>`,
    });
    const notFound = page.root?.shadowRoot?.querySelector('.not-found');
    expect(notFound).not.toBeNull();
  });

  it('renders detail rows for a valid entry', async () => {
    const page = await newSpecPage({
      components: [ContractDetail],
      html: `<contract-detail entry-id="0"></contract-detail>`,
    });
    const rows = page.root?.shadowRoot?.querySelectorAll('.detail-row');
    expect(rows.length).toBeGreaterThan(0);
  });
});
