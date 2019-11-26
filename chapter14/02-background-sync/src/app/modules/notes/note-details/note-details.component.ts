import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../core/snack-bar.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  public errorMessages$ = new Subject();
  public note$;
  public isEdit;

  private id;

  constructor(
    private data: DataService,
    private route: ActivatedRoute,
    private snackBar: SnackBarService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    // this.note$ = this.data.getNote(id);
    this.note$ = this.data.getNoteFromDirectApi(id);
  }

  delete() {
    if (confirm('Are you sure?')) {
      // to test Background Sync
      this.data
        .deleteNoteDirectly(this.id)
        .then(() => {
          this.snackBar.open(`${this.id} successfully was deleted`);
        })
        .catch(e => {
          this.snackBar.open('Unable to delete this note');
        });
      this.router.navigate(['/notes']);
    }
  }

  edit() {
    this.isEdit = !this.isEdit;
  }

  saveNote(values) {
    this.data
      .editNote(this.id, values)
      .then(() => {
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
