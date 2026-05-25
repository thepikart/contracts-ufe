import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { HospitalContractsApi, Contract, Configuration } from '../../api/contracts';

type SortField = 'date' | 'name' | 'budget';
type SortDir = 'asc' | 'desc';

@Component({
  tag: 'contract-list',
  styleUrl: 'contract-list.css',
  shadow: true,
})
export class ContractList {

  @Prop() apiBase: string = '';
  @State() contracts: Contract[] = [];
  @State() sortField: SortField = 'date';
  @State() sortDir: SortDir = 'asc';
  @State() errorMessage: string = '';

  @Event({ eventName: "entry-clicked" }) entryClicked: EventEmitter<string>;

  private async getContractsAsync(): Promise<Contract[]> {
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });
      const contractsApi = new HospitalContractsApi(configuration);
      const response = await contractsApi.getContractsRaw({});
      if (response.raw.status < 299) {
        return await response.value();
      } else {
        this.errorMessage = `Cannot retrieve list of contracts: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of contracts: ${err.message || "unknown"}`;
    }
    return [];
  }

  async componentWillLoad() {
    this.contracts = await this.getContractsAsync();
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
      case 'Active': return 'status-active';
      case 'Ended': return 'status-ended';
      case 'Archived': return 'status-archived';
      default: return '';
    }
  }

  private getStatusLabel(status: string): string {
    switch (status) {
      case 'Active': return 'Aktívna';
      case 'Ended': return 'Ukončená';
      case 'Archived': return 'Archivovaná';
      default: return status;
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
          <md-icon-button onClick={() => this.entryClicked.emit('@new')}>
            <md-icon>add</md-icon>
          </md-icon-button>
        </div>

        {this.errorMessage
          ? <div class="error">{this.errorMessage}</div>
          : [
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
            </div>,

            <md-list>
              {this.getSorted().map(({ contract }) =>
                <md-list-item class={`border-${contract.status?.toLowerCase()}`} onClick={() => this.entryClicked.emit(contract.contractNumber)}>
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
                      {this.getStatusLabel(contract.status)}
                    </span>
                    <div class="contract-number">{contract.contractNumber}</div>
                  </div>
                </md-list-item>
              )}
            </md-list>
          ]
        }
      </Host>
    );
  }
}