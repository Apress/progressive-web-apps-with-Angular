import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteFormComponent } from './note-form.component';

describe('NoteFormComponent', () => {
  let component: NoteFormComponent;
  let fixture: ComponentFixture<NoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
