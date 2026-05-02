import { newSpecPage } from '@stencil/core/testing';
import { ContractEditor } from '../contract-editor';

describe('contract-editor', () => {
  it('buttons shall be of different type', async () => {
    const page = await newSpecPage({
      components: [ContractEditor],
      html: `<contract-editor entry-id="@new"></contract-editor>`,
    });
    let items: any = await page.root.shadowRoot.querySelectorAll("md-filled-button");
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll("md-outlined-button");
    expect(items.length).toEqual(1);

    items = await page.root.shadowRoot.querySelectorAll("md-filled-tonal-button");
    expect(items.length).toEqual(1);
  });
});