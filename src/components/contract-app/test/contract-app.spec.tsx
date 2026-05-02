import { newSpecPage } from '@stencil/core/testing';
import { ContractApp } from '../contract-app';

describe('contract-app', () => {

  it('renders editor', async () => {
    const page = await newSpecPage({
      url: `http://localhost/entry/@new`,
      components: [ContractApp],
      html: `<contract-app base-path="/"></contract-app>`,
    });
    page.win.navigation = new EventTarget()
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual("contract-editor");
  });

  it('renders list', async () => {
    const page = await newSpecPage({
      url: `http://localhost/contracts/`,
      components: [ContractApp],
      html: `<contract-app base-path="/contracts/"></contract-app>`,
    });
    page.win.navigation = new EventTarget()
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual("contract-list");
  });
});