import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../core/snack-bar.service';
import { Subject, from } from 'rxjs';
import { OfflineDbService } from '../../core/offline-db.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  public errorMessages$ = new Subject();
  public note;
  public isEdit;

  private id;

  constructor(
    private offlineDB: OfflineDbService,
    private route: ActivatedRoute,
    private snackBar: SnackBarService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    // this.note$ = this.data.getNote(id);
    this.getNote(id);
  }

  getNote(id) {
    this.offlineDB.get(id).then(note => {
      this.note = note;
    });
  }

  delete() {
    if (confirm('Are you sure?')) {
      this.offlineDB
        .delete(this.id)
        .then(() => {
          this.router.navigate(['/notes']);
          this.snackBar.open(`${this.id} successfully was deleted`);
        })
        .catch(e => {
          this.snackBar.open('Unable to delete this note');
        });
    }
  }

  edit() {
    this.isEdit = !this.isEdit;
  }

  saveNote(values) {
    this.offlineDB
      .edit(values)
      .then(() => {
        this.getNote(values._id);
        this.snackBar.open('Successfully done');
        this.edit();
      })
      .catch(e => {
        this.snackBar.open('Unable to edit this note');
        this.edit();
      });
  }

  sendError(message) {
    this.errorMessages$.next(message);
  }
}
