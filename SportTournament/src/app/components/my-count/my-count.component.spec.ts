import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCountComponent } from './my-count.component';

describe('MyCountComponent', () => {
  let component: MyCountComponent;
  let fixture: ComponentFixture<MyCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
