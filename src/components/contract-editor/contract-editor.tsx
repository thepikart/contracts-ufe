import { Component, Host, Prop, State, h, EventEmitter, Event } from '@stencil/core';
import { CONTRACTS } from '../../utils/contracts-data';

@Component({
  tag: 'contract-editor',
  styleUrl: 'contract-editor.css',
  shadow: true,
})
export class ContractEditor {

  @Prop() entryId: string;

  @Event({ eventName: "editor-closed" }) editorClosed: EventEmitter<string>;

  @State() private budget: number = 0;

  private handleBudgetInput(event: Event) {
    this.budget = +(event.target as HTMLInputElement).value;
  }

  render() {
    const isNew = this.entryId === "@new";
    const title = isNew
      ? "Nová zmluva"
      : (CONTRACTS[parseInt(this.entryId)]?.name ?? "Upraviť zmluvu");

    return (
      <Host>
        <div class="header">
          <md-icon-button onClick={() => this.editorClosed.emit("cancel")}>
            <md-icon>arrow_back</md-icon>
          </md-icon-button>
          <h2>{title}</h2>
        </div>

        <md-divider></md-divider>

        <md-filled-text-field label="Číslo zmluvy">
          <md-icon slot="leading-icon">tag</md-icon>
        </md-filled-text-field>

        <md-filled-text-field label="Názov zmluvy">
          <md-icon slot="leading-icon">description</md-icon>
        </md-filled-text-field>

        <md-filled-text-field label="Externý partner">
          <md-icon slot="leading-icon">business</md-icon>
        </md-filled-text-field>

        <md-filled-select label="Typ služby">
          <md-icon slot="leading-icon">category</md-icon>
          <md-select-option value="it">
            <div slot="headline">IT podpora</div>
          </md-select-option>
          <md-select-option value="cleaning">
            <div slot="headline">Upratovanie</div>
          </md-select-option>
          <md-select-option value="material">
            <div slot="headline">Dodávka materiálu</div>
          </md-select-option>
          <md-select-option value="security">
            <div slot="headline">Bezpečnostné služby</div>
          </md-select-option>
          <md-select-option value="other">
            <div slot="headline">Iné</div>
          </md-select-option>
        </md-filled-select>

        <md-filled-text-field label="Platnosť od" type="date">
          <md-icon slot="leading-icon">calendar_today</md-icon>
        </md-filled-text-field>

        <md-filled-text-field label="Platnosť do" type="date">
          <md-icon slot="leading-icon">event</md-icon>
        </md-filled-text-field>

        <div class="budget-field">
          <md-filled-text-field
            label="Finančné prostriedky (€)"
            type="number"
            value={String(this.budget)}
            oninput={this.handleBudgetInput.bind(this)}>
            <md-icon slot="leading-icon">euro</md-icon>
          </md-filled-text-field>
          <span class="budget-display">{this.budget.toLocaleString()} €</span>
        </div>

        <md-filled-select label="Stav zmluvy">
          <md-icon slot="leading-icon">info</md-icon>
          <md-select-option value="active">
            <div slot="headline">Aktívna</div>
          </md-select-option>
          <md-select-option value="ended">
            <div slot="headline">Ukončená</div>
          </md-select-option>
          <md-select-option value="archived">
            <div slot="headline">Archivovaná</div>
          </md-select-option>
        </md-filled-select>

        <md-divider></md-divider>

        <div class="actions">
          <md-filled-tonal-button id="delete"
            onClick={() => this.editorClosed.emit("delete")}>
            <md-icon slot="icon">delete</md-icon>
            Archivovať
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel"
            onClick={() => this.editorClosed.emit("cancel")}>
            Zrušiť
          </md-outlined-button>
          <md-filled-button id="confirm"
            onClick={() => this.editorClosed.emit("store")}>
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
        </div>
      </Host>
    );
  }
}