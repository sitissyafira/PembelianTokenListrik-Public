import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlastNotificationComponent } from './blast-notification.component';

describe('BlastNotificationComponent', () => {
  let component: BlastNotificationComponent;
  let fixture: ComponentFixture<BlastNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlastNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlastNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
