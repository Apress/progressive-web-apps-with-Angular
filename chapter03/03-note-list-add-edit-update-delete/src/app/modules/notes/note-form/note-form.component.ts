import { Component, OnInit, Input, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "app-note-form",
  templateUrl: "./note-form.component.html",
  styleUrls: ["./note-form.component.scss"]
})
export class NoteFormComponent implements OnInit {
  noteForm: FormGroup;

  @Input()
  note;

  @Output()
  saveNote = new EventEmitter();

  @Output()
  sendError = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();

    if (this.note) {
      this.noteForm.patchValue(this.note);
    }
  }

  createForm() {
    this.noteForm = this.fb.group({
      title: ["", Validators.required],
      content: ["", Validators.required]
    });
  }

  addNote() {
    if (this.noteForm.valid) {
      this.saveNote.emit(this.noteForm.value);
    } else {
      this.sendError.emit("please fill all fields");
    }
  }
}
