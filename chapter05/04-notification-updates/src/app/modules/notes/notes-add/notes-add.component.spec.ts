import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesAddComponent } from './notes-add.component';

describe('NotesAddComponent', () => {
  let component: NotesAddComponent;
  let fixture: ComponentFixture<NotesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
