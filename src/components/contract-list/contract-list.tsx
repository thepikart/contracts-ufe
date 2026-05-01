import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'contract-list',
  styleUrl: 'contract-list.css',
  shadow: true,
})

export class ContractList {
  contracts: any[];

  private async getContractsAsync() {
    return await Promise.resolve([
      {
        contractNumber: 'ZML-2024-001',
        name: 'IT podpora a správa systémov',
        partner: 'TechSupport s.r.o.',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        budget: 15000,
        status: 'Aktívna'
      },
      {
        contractNumber: 'ZML-2024-002',
        name: 'Upratovanie a čistenie priestorov',
        partner: 'CleanPro a.s.',
        validFrom: new Date('2024-03-01'),
        validUntil: new Date('2025-02-28'),
        budget: 8400,
        status: 'Aktívna'
      },
      {
        contractNumber: 'ZML-2023-047',
        name: 'Dodávka zdravotníckeho materiálu',
        partner: 'MedSupply s.r.o.',
        validFrom: new Date('2023-06-01'),
        validUntil: new Date('2024-05-31'),
        budget: 13,
        status: 'Ukončená'
      }
    ]);
  }

  async componentWillLoad() {
    this.contracts = await this.getContractsAsync();
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <md-list>
          {this.contracts.map(contract =>
            <md-list-item>
              <div slot="headline">{contract.name}</div>
              <div slot="supporting-text">
                {'Partner: ' + contract.partner + ' | Platnosť do: ' + contract.validUntil?.toLocaleDateString() + ' | Stav: ' + contract.status}
              </div>
              <md-icon slot="start">description</md-icon>
            </md-list-item>
          )}
        </md-list>
      </Host>
    );
  }
}
