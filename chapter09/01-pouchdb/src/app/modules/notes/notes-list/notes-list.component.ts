import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../core/data.service';
import { Observable } from 'rxjs';
import { AddToHomeScreenService } from '../../core/add-to-home-screen.service';
import { OfflineDbService } from '../../core/offline-db.service';

interface Note {
  key: string;
  title: string;
  contnet: string;
  date: string;
}

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {
  notes$: Note[];
  isAddToHomeScreenEnabled$;

  constructor(
    private offlineDB: OfflineDbService,
    private a2hs: AddToHomeScreenService
  ) {}

  ngOnInit() {
    this.offlineDB.getAll().then(allDoc => {
      this.notes$ = allDoc;
    });

    this.isAddToHomeScreenEnabled$ = this.a2hs.deferredPromptFired;
  }

  showPrompt() {
    this.a2hs.showPrompt();
  }
}
