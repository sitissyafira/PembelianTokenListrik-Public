import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBlastNotificationComponent } from './list-blast-notification.component';

describe('ListBlastNotificationComponent', () => {
  let component: ListBlastNotificationComponent;
  let fixture: ComponentFixture<ListBlastNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBlastNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBlastNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
