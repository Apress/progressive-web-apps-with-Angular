import { Injectable, NgZone } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class OfflineDbService {
  private readonly LOCAL_DB_NAME = 'apress_pwa_note';
  private readonly DB_NAME = `${this.LOCAL_DB_NAME}__${this.auth.id}`;
  private readonly REMOTE_DB = `http://localhost:5984/${this.DB_NAME}`;
  private _DB: PouchDB.Database;
  private listener = null;
  private _allDocs: any[];

  get timestamp() {
    return;
  }

  constructor(private auth: AuthService, private ngZone: NgZone) {
    this._DB = new PouchDB(this.DB_NAME);
    this._DB.sync(this.REMOTE_DB, {
      live: true,
      retry: true
    });
  }

  listenToDBChange() {
    if (this.listener) {
      return;
    }

    this.listener = this._DB
      .changes({ live: true, since: 'now', include_docs: true })
      .on('change', change => {
        this.onDBChange(change);
      });
  }

  private onDBChange(change) {
    console.log('>>>>>> DBChange', change);
    this.ngZone.run(() => {
      const index = this._allDocs.findIndex(row => row._id === change.id);

      if (change.deleted) {
        this._allDocs.splice(index, 1);
        return;
      }

      if (index > -1) {
        // doc is updated
        this._allDocs[index] = change.doc;
      } else {
        // new doc
        this._allDocs.unshift(change.doc);
      }
    });
  }

  public async getAll(page?: number) {
    const doc = await this._DB.allDocs({
      include_docs: true,
      limit: 40,
      skip: page || 0
    });
    this._allDocs = doc.rows.map(row => row.doc);
    // Handle database change on documents
    this.listenToDBChange();
    return this._allDocs;
  }

  public get(id: string) {
    return this._DB.get(id);
  }

  public async delete(id) {
    const doc = await this.get(id);
    const deleteResult = this._DB.remove(doc);
    return deleteResult;
  }

  public add(note: any) {
    return this._DB.post({
      ...note,
      created_at: this.timestamp,
      updated_at: this.timestamp
    });
  }

  public async edit(document: any) {
    const result = await this.get(document._id);
    document._rev = result._rev;
    return this._DB.put({
      ...document,
      updated_at: this.timestamp
    });
  }
}
