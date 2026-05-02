import { Component, Event, EventEmitter, Host, h, State } from '@stencil/core';
import { CONTRACTS, Contract } from '../../utils/contracts-data';

type SortField = 'date' | 'name' | 'budget';
type SortDir = 'asc' | 'desc';

@Component({
  tag: 'contract-list',
  styleUrl: 'contract-list.css',
  shadow: true,
})
export class ContractList {

  @State() contracts: Contract[];
  @State() sortField: SortField = 'date';
  @State() sortDir: SortDir = 'asc';

  @Event({ eventName: "entry-clicked" }) entryClicked: EventEmitter<string>;

  componentWillLoad() {
    this.contracts = CONTRACTS;
  }

  private setSort(field: SortField) {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
  }

  private getSorted(): { contract: Contract; index: number }[] {
    const indexed = this.contracts.map((c, i) => ({ contract: c, index: i }));
    return indexed.sort((a, b) => {
      let cmp = 0;
      if (this.sortField === 'name') {
        cmp = a.contract.name.localeCompare(b.contract.name);
      } else if (this.sortField === 'date') {
        cmp = a.contract.validFrom.getTime() - b.contract.validFrom.getTime();
      } else if (this.sortField === 'budget') {
        cmp = a.contract.budget - b.contract.budget;
      }
      return this.sortDir === 'asc' ? cmp : -cmp;
    });
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'Aktívna': return 'status-active';
      case 'Ukončená': return 'status-ended';
      case 'Archivovaná': return 'status-archived';
      default: return '';
    }
  }

  render() {
    const SORT_LABELS: Record<SortField, string> = {
      date: 'Dátum',
      name: 'Názov',
      budget: 'Rozpočet',
    };

    return (
      <Host>
        <div class="header">
          <h2>Zmluvy s externými partnermi</h2>
          <md-icon-button>
            <md-icon>add</md-icon>
          </md-icon-button>
        </div>

        <div class="sort-bar">
          {(['date', 'name', 'budget'] as SortField[]).map(field => (
            <button
              class={`sort-btn${this.sortField === field ? ' active' : ''}`}
              onClick={() => this.setSort(field)}>
              {SORT_LABELS[field]}
              {this.sortField === field && (
                <md-icon class="sort-icon">
                  {this.sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                </md-icon>
              )}
            </button>
          ))}
        </div>

        <md-list>
          {this.getSorted().map(({ contract, index }) =>
            <md-list-item onClick={() => this.entryClicked.emit(index.toString())}>
              <div slot="headline">
                <span class="contract-name">{contract.name}</span>
              </div>
              <div slot="supporting-text">
                <span>
                  <md-icon class="inline-icon">business</md-icon>
                  {contract.partner}
                </span>
                <span>
                  <md-icon class="inline-icon">calendar_today</md-icon>
                  {contract.validFrom?.toLocaleDateString()} – {contract.validUntil?.toLocaleDateString()}
                </span>
                <span>
                  <md-icon class="inline-icon">euro</md-icon>
                  {contract.budget.toLocaleString()} €
                </span>
              </div>
              <div slot="end">
                <span class={`status-badge ${this.getStatusColor(contract.status)}`}>
                  {contract.status}
                </span>
                <div class="contract-number">{contract.contractNumber}</div>
              </div>
            </md-list-item>
          )}
        </md-list>
      </Host>
    );
  }
}