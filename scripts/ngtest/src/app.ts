import { Component } from "@angular/core"
import { DeckViewerComponent } from "@mvng267/deck-kit/angular"
import type { DeckJson } from "@mvng267/deck-kit"

@Component({
  standalone: true,
  selector: "app-deck-viewer",
  imports: [DeckViewerComponent],
  template: `<edm-deck [deck]="deck" [theme]="'navy-gold'"></edm-deck>`,
  styles: [`:host { display: block; height: 100vh }`],
})
export class DeckPage {
  deck: DeckJson = { version: 1, title: "Bài 1", slides: [] }
}
