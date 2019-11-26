import { NgModule } from "@angular/core";

import { NotesRoutingModule } from "./notes-routing.module";
import { NotesListComponent } from "./notes-list/notes-list.component";
import { NotesAddComponent } from "./notes-add/notes-add.component";
import { NoteDetailsComponent } from "./note-details/note-details.component";
import { SharedModule } from "../shared/shared.module";
import { NoteCardComponent } from "./note-card/note-card.component";
import { NoteFormComponent } from './note-form/note-form.component';

@NgModule({
  imports: [SharedModule, NotesRoutingModule],
  declarations: [
    NotesListComponent,
    NotesAddComponent,
    NoteDetailsComponent,
    NoteCardComponent,
    NoteFormComponent
  ]
})
export class NotesModule {}
