import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-blast-notification',
  templateUrl: './blast-notification.component.html',
  styleUrls: ['./blast-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlastNotificationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
