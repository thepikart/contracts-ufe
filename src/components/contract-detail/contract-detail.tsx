import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { HospitalContractsApi, Contract, Configuration, ResponseError } from '../../api/contracts';

@Component({
  tag: 'contract-detail',
  styleUrl: 'contract-detail.css',
  shadow: true,
})
export class ContractDetail {

  @Prop() entryId: string = '';
  @Prop() apiBase: string = '';

  @Event({ eventName: "detail-closed" }) detailClosed: EventEmitter<void>;
  @Event({ eventName: "edit-clicked" }) editClicked: EventEmitter<string>;

  @State() contract: Contract;
  @State() errorMessage: string = '';

  async componentWillLoad() {
    this.contract = await this.getContractAsync();
  }

  private async getContractAsync(): Promise<Contract> {
    try {
      const configuration = new Configuration({ basePath: this.apiBase });
      const contractsApi = new HospitalContractsApi(configuration);
      const response = await contractsApi.getContractRaw({ contractId: this.entryId });
      if (response.raw.status < 299) {
        return await response.value();
      }
    } catch (err: any) {
      if (err instanceof ResponseError && err.response.status === 404) {
        return undefined;
      }
      this.errorMessage = `Cannot retrieve contract: ${err.message || "unknown"}`;
    }
    return undefined;
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
    if (this.errorMessage) {
      return <Host><div class="error">{this.errorMessage}</div></Host>;
    }
    if (!this.contract) {
      return <Host><p class="not-found">Zmluva nenájdená.</p></Host>;
    }

    const c = this.contract;

    return (
      <Host>
        <div class="header">
          <md-icon-button onClick={() => this.detailClosed.emit()}>
            <md-icon>arrow_back</md-icon>
          </md-icon-button>
          <h2>{c.name}</h2>
          <md-icon-button onClick={() => this.editClicked.emit(this.entryId)}>
            <md-icon>edit</md-icon>
          </md-icon-button>
        </div>

        <div class="meta">
          <span class="contract-number">{c.contractNumber}</span>
          <span class={`status-badge ${this.getStatusColor(c.status)}`}>{this.getStatusLabel(c.status)}</span>
        </div>

        <md-divider></md-divider>

        <div class="detail-grid">
          <div class="detail-row">
            <md-icon class="detail-icon">business</md-icon>
            <div>
              <div class="detail-label">Externý partner</div>
              <div class="detail-value">{c.partner}</div>
            </div>
          </div>

          <div class="detail-row">
            <md-icon class="detail-icon">category</md-icon>
            <div>
              <div class="detail-label">Typ služby</div>
              <div class="detail-value">{c.serviceType || '—'}</div>
            </div>
          </div>

          <div class="detail-row">
            <md-icon class="detail-icon">calendar_today</md-icon>
            <div>
              <div class="detail-label">Platnosť od</div>
              <div class="detail-value">{c.validFrom?.toLocaleDateString()}</div>
            </div>
          </div>

          <div class="detail-row">
            <md-icon class="detail-icon">event</md-icon>
            <div>
              <div class="detail-label">Platnosť do</div>
              <div class="detail-value">{c.validUntil?.toLocaleDateString()}</div>
            </div>
          </div>

          <div class="detail-row">
            <md-icon class="detail-icon">euro</md-icon>
            <div>
              <div class="detail-label">Finančné prostriedky</div>
              <div class="detail-value budget">{c.budget.toLocaleString()} €</div>
            </div>
          </div>

          {c.description && (
            <div class="detail-row">
              <md-icon class="detail-icon">notes</md-icon>
              <div>
                <div class="detail-label">Popis</div>
                <div class="detail-value">{c.description}</div>
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
