import { newE2EPage } from '@stencil/core/testing';

describe('contract-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<contract-app></contract-app>');

    const element = await page.find('contract-app');
    expect(element).toHaveClass('hydrated');
  });
});
