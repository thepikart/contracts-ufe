import { newE2EPage } from '@stencil/core/testing';

describe('contract-detail', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<contract-detail></contract-detail>');

    const element = await page.find('contract-detail');
    expect(element).toHaveClass('hydrated');
  });
});
