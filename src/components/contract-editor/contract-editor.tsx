import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';
import { HospitalContractsApi, Contract, Configuration } from '../../api/contracts';

@Component({
  tag: 'contract-editor',
  styleUrl: 'contract-editor.css',
  shadow: true,
})
export class ContractEditor {

  @Prop() entryId: string = '';
  @Prop() apiBase: string = '';

  @Event({ eventName: "editor-closed" }) editorClosed: EventEmitter<string>;

  @State() entry: Contract = undefined;
  @State() errorMessage: string = '';
  @State() isValid: boolean = false;
  @State() private budget: number = 0;

  private formElement: HTMLFormElement;

  componentWillLoad() {
    this.getContractAsync();
  }

  private async getContractAsync(): Promise<Contract> {
    if (this.entryId === '@new') {
      this.isValid = false;
      this.entry = {
        contractNumber: '',
        name: '',
        partner: '',
        validFrom: undefined,
        validUntil: undefined,
        budget: 0,
        status: 'Active' as any,
      };
      return this.entry;
    }
    if (!this.entryId) {
      this.isValid = false;
      return undefined;
    }
    try {
      const configuration = new Configuration({
        basePath: this.apiBase,
      });
      const contractsApi = new HospitalContractsApi(configuration);
      const response = await contractsApi.getContractRaw({ contractId: this.entryId });
      if (response.raw.status < 299) {
        this.entry = await response.value();
        this.budget = this.entry.budget;
        this.isValid = true;
      } else {
        this.errorMessage = `Cannot retrieve contract: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve contract: ${err.message || "unknown"}`;
    }
    return undefined;
  }

  private handleInputEvent(ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    this.validateForm('silent');
    return target.value;
  }

  private validateForm(mode: 'silent' | 'show-errors'): boolean {
    this.isValid = true;
    for (let i = 0; i < this.formElement.children.length; i++) {
      const element = this.formElement.children[i] as HTMLElement & {
        checkValidity?: () => boolean;
        reportValidity?: () => boolean;
      };
      let valid = true;
      if (mode === 'show-errors' && element.reportValidity) {
        valid = element.reportValidity();
      } else if (element.checkValidity) {
        valid = element.checkValidity();
      }
      this.isValid &&= valid;
    }
    return this.isValid;
  }

  private async deleteEntry() {
    try {
      const configuration = new Configuration({ basePath: this.apiBase });
      const contractsApi = new HospitalContractsApi(configuration);
      const response = await contractsApi.deleteContractRaw({ contractId: this.entryId });
      if (response.raw.status < 299) {
        this.editorClosed.emit("delete");
      } else {
        this.errorMessage = `Cannot delete contract: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot delete contract: ${err.message || "unknown"}`;
    }
  }

  private async updateEntry() {
    if (!this.validateForm('show-errors')) {
      return;
    }
    try {
      const configuration = new Configuration({ basePath: this.apiBase });
      const contractsApi = new HospitalContractsApi(configuration);
      const isNew = this.entryId === "@new";
      const response = isNew
        ? await contractsApi.createContractRaw({ contract: this.entry })
        : await contractsApi.updateContractRaw({ contractId: this.entryId, contract: this.entry });
      if (response.raw.status < 299) {
        this.editorClosed.emit("store");
      } else {
        this.errorMessage = `Cannot save contract: ${response.raw.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot save contract: ${err.message || "unknown"}`;
    }
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      );
    }

    const isNew = this.entryId === "@new";
    const title = isNew ? "Nová zmluva" : (this.entry?.name ?? "Upraviť zmluvu");

    const toDateString = (d: Date) => d ? new Date(d).toISOString().substring(0, 10) : '';

    return (
      <Host>
        <div class="header">
          <md-icon-button onClick={() => this.editorClosed.emit("cancel")}>
            <md-icon>arrow_back</md-icon>
          </md-icon-button>
          <h2>{title}</h2>
        </div>

        <md-divider></md-divider>

        <form ref={el => this.formElement = el as HTMLFormElement}>
          <md-filled-text-field label="Číslo zmluvy"
            required pattern=".*\S.*" value={this.entry?.contractNumber}
            oninput={(ev: InputEvent) => {
              if (this.entry) { this.entry.contractNumber = this.handleInputEvent(ev); }
            }}>
            <md-icon slot="leading-icon">tag</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Názov zmluvy"
            required pattern=".*\S.*" value={this.entry?.name}
            oninput={(ev: InputEvent) => {
              if (this.entry) { this.entry.name = this.handleInputEvent(ev); }
            }}>
            <md-icon slot="leading-icon">description</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Externý partner"
            required pattern=".*\S.*" value={this.entry?.partner}
            oninput={(ev: InputEvent) => {
              if (this.entry) { this.entry.partner = this.handleInputEvent(ev); }
            }}>
            <md-icon slot="leading-icon">business</md-icon>
          </md-filled-text-field>

          <md-filled-select label="Typ služby"
            value={this.entry?.serviceType}
            oninput={(ev: InputEvent) => {
              if (this.entry) { this.entry.serviceType = this.handleInputEvent(ev) as any; }
            }}>
            <md-icon slot="leading-icon">category</md-icon>
            <md-select-option value="IT Support">
              <div slot="headline">IT podpora</div>
            </md-select-option>
            <md-select-option value="Cleaning">
              <div slot="headline">Upratovanie</div>
            </md-select-option>
            <md-select-option value="Material Supply">
              <div slot="headline">Dodávka materiálu</div>
            </md-select-option>
            <md-select-option value="Security Services">
              <div slot="headline">Bezpečnostné služby</div>
            </md-select-option>
            <md-select-option value="Other">
              <div slot="headline">Iné</div>
            </md-select-option>
          </md-filled-select>

          <md-filled-text-field label="Platnosť od" type="date"
            value={toDateString(this.entry?.validFrom)}
            oninput={(ev: InputEvent) => {
              if (this.entry) { this.entry.validFrom = new Date(this.handleInputEvent(ev)); }
            }}>
            <md-icon slot="leading-icon">calendar_today</md-icon>
          </md-filled-text-field>

          <md-filled-text-field label="Platnosť do" type="date"
            value={toDateString(this.entry?.validUntil)}
            oninput={(ev: InputEvent) => {
              if (this.entry) { this.entry.validUntil = new Date(this.handleInputEvent(ev)); }
            }}>
            <md-icon slot="leading-icon">event</md-icon>
          </md-filled-text-field>

          <div class="budget-field">
            <md-filled-text-field
              label="Finančné prostriedky (€)"
              type="number"
              value={String(this.budget)}
              oninput={(ev: InputEvent) => {
                const val = Number(this.handleInputEvent(ev));
                this.budget = val;
                if (this.entry) { this.entry.budget = val; }
              }}>
              <md-icon slot="leading-icon">euro</md-icon>
            </md-filled-text-field>
            <span class="budget-display">{this.budget.toLocaleString()} €</span>
          </div>

          <md-filled-select label="Stav zmluvy"
            value={this.entry?.status}
            oninput={(ev: InputEvent) => {
              if (this.entry) { this.entry.status = this.handleInputEvent(ev) as any; }
            }}>
            <md-icon slot="leading-icon">info</md-icon>
            <md-select-option value="Active">
              <div slot="headline">Aktívna</div>
            </md-select-option>
            <md-select-option value="Ended">
              <div slot="headline">Ukončená</div>
            </md-select-option>
            <md-select-option value="Archived">
              <div slot="headline">Archivovaná</div>
            </md-select-option>
          </md-filled-select>

          <md-filled-text-field label="Popis" type="textarea" rows={3}
            value={this.entry?.description}
            oninput={(ev: InputEvent) => {
              if (this.entry) { this.entry.description = this.handleInputEvent(ev); }
            }}>
            <md-icon slot="leading-icon">notes</md-icon>
          </md-filled-text-field>
        </form>

        <md-divider></md-divider>

        <div class="actions">
          <md-filled-tonal-button id="delete" disabled={!this.entry || this.entryId === '@new'}
            onClick={() => this.deleteEntry()}>
            <md-icon slot="icon">delete</md-icon>
            Archivovať
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel"
            onClick={() => this.editorClosed.emit("cancel")}>
            Zrušiť
          </md-outlined-button>
          <md-filled-button id="confirm"
            onClick={() => this.updateEntry()}>
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
        </div>
      </Host>
    );
  }
}