import { Component, Host, Prop, State, h } from '@stencil/core';

declare global {
  interface Window { navigation: any; }
}

@Component({
  tag: 'contract-app',
  styleUrl: 'contract-app.css',
  shadow: true,
})
export class ContractApp {

  @State() private relativePath = "";

  @Prop() basePath: string = "";

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || "/").pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length)
      } else {
        this.relativePath = ""
      }
    }

    window.navigation?.addEventListener("navigate", (ev: Event) => {
      if ((ev as any).canIntercept) { (ev as any).intercept(); }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname)
  }

  render() {
    let element = "list"
    let entryId = "@new"

    if (this.relativePath.startsWith("entry/")) {
      element = "editor";
      entryId = this.relativePath.split("/")[1]
    } else if (this.relativePath.startsWith("detail/")) {
      element = "detail";
      entryId = this.relativePath.split("/")[1]
    }

    const navigate = (path: string) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute)
    }

    return (
      <Host>
        {element === "editor"
          ? <contract-editor entry-id={entryId}
            oneditor-closed={() => entryId !== "@new" ? navigate("./detail/" + entryId) : navigate("./list")}>
          </contract-editor>
          : element === "detail"
          ? <contract-detail entry-id={entryId}
            ondetail-closed={() => navigate("./list")}
            onedit-clicked={(ev: CustomEvent<string>) => navigate("./entry/" + ev.detail)}>
          </contract-detail>
          : <contract-list
            onentry-clicked={(ev: CustomEvent<string>) => navigate("./detail/" + ev.detail)}>
          </contract-list>
        }
      </Host>
    );
  }
}