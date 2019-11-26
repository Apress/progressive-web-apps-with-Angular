import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataService } from "../../core/data.service";
import { Observable, Subject, Subscription } from "rxjs";

interface Note {
  key: string;
  title: string;
  contnet: string;
  date: string;
}

@Component({
  selector: "app-notes-list",
  templateUrl: "./notes-list.component.html",
  styleUrls: ["./notes-list.component.scss"]
})
export class NotesListComponent implements OnInit {
  notes$: Observable<Note[]>;
  isDbLoading$;

  constructor(private db: DataService) {}

  ngOnInit() {
    this.notes$ = this.db.getNotes();
    this.isDbLoading$ = this.db.isLoading$;
  }
}
