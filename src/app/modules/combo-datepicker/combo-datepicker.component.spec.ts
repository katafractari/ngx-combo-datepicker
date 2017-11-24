import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboDatepickerComponent } from './combo-datepicker.component';

describe('ComboDatepickerComponent', () => {
  let component: ComboDatepickerComponent;
  let fixture: ComponentFixture<ComboDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
