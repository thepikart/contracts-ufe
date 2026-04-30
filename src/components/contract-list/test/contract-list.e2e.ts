import { newE2EPage } from '@stencil/core/testing';

describe('contract-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<contract-list></contract-list>');

    const element = await page.find('contract-list');
    expect(element).toHaveClass('hydrated');
  });
});
