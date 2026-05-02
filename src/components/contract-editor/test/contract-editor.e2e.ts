import { newE2EPage } from '@stencil/core/testing';

describe('contract-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<contract-editor></contract-editor>');

    const element = await page.find('contract-editor');
    expect(element).toHaveClass('hydrated');
  });
});
